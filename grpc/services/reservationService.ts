import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { filter, paginate, sort } from './filters';
import { Reservation } from '../types/propertyAPI/Reservation';
import { ReservationId } from '../types/propertyAPI/ReservationId';
import { Reservations } from '../types/propertyAPI/Reservations';
import { Query } from '../types/propertyAPI/Query';
import { DeleteReservationResponse } from '../types/propertyAPI/DeleteReservationResponse';

type ReservationWithDates = Omit<Reservation, 'date'> & {
  date: {
    start: Date | undefined;
    end: Date | undefined;
  };
};

const reservationsFilePath = 'data/reservation.json';
const reservations: ReservationWithDates[] = JSON.parse(fs.readFileSync(reservationsFilePath, 'utf8')).map((reservation: Reservation) => ({
  ...reservation,
  date: {
    start: reservation.date?.start ? new Date(reservation.date.start) : undefined,
    end: reservation.date?.end ? new Date(reservation.date.end) : undefined,
  },
}));

const convertToReservation = (reservation: ReservationWithDates): Reservation => ({
  ...reservation,
  date: {
    start: reservation.date.start?.toISOString() || '',
    end: reservation.date.end?.toISOString() || '',
  },
});

const reservationService = {
  readReservation: (
    call: grpc.ServerUnaryCall<ReservationId, Reservation>,
    callback: grpc.sendUnaryData<Reservation>
  ) => {
    const reservation = reservations.find(r => r.id === call.request.id);
    if (reservation) {
      callback(null, convertToReservation(reservation));
    } else {
      callback({ code: grpc.status.NOT_FOUND, details: 'Reservation not found' });
    }
  },

  readReservations: (
    call: grpc.ServerUnaryCall<Query, Reservations>,
    callback: grpc.sendUnaryData<Reservations>
  ) => {
    let result: ReservationWithDates[] = [...reservations];

    if (call.request.filters) {
      result = filter(result, call.request.filters);
    }

    if (call.request.sorts) {
      result = sort(result, call.request.sorts);
    }

    if (call.request.pagination) {
      result = paginate(result, call.request.pagination);
    }

    callback(null, { reservations: result.map(convertToReservation) });
  },

  createReservation: (
    call: grpc.ServerUnaryCall<Reservation, Reservation>,
    callback: grpc.sendUnaryData<Reservation>
  ) => {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const newReservation: ReservationWithDates = {
      ...call.request,
      id: reservations.length ? Math.max(...reservations.map(r => r.id).filter(id => id !== undefined)) + 1 : 1,
      date: {
        start: today,
        end: threeDaysLater,
      },
    };

    reservations.push(newReservation);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));

    callback(null, convertToReservation(newReservation));
  },

  updateReservation: (
    call: grpc.ServerUnaryCall<Reservation, Reservation>,
    callback: grpc.sendUnaryData<Reservation>
  ) => {
    const reservationIndex = reservations.findIndex(r => r.id === call.request.id);

    if (reservationIndex === -1) {
      callback({ code: grpc.status.NOT_FOUND, details: 'Reservation not found' });
      return;
    }

    const updatedReservation: ReservationWithDates = {
      ...reservations[reservationIndex],
      ...call.request,
      date: {
        start: call.request.date?.start ? new Date(call.request.date.start) : reservations[reservationIndex].date.start,
        end: call.request.date?.end ? new Date(call.request.date.end) : reservations[reservationIndex].date.end,
      },
    };

    reservations[reservationIndex] = updatedReservation;
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));

    callback(null, convertToReservation(updatedReservation));
  },

  deleteReservation: (
    call: grpc.ServerUnaryCall<ReservationId, DeleteReservationResponse>,
    callback: grpc.sendUnaryData<DeleteReservationResponse>
  ) => {
    const reservationIndex = reservations.findIndex(r => r.id === call.request.id);

    if (reservationIndex === -1) {
      callback({ code: grpc.status.NOT_FOUND, details: 'Reservation not found' });
      return;
    }

    reservations.splice(reservationIndex, 1);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));

    callback(null, { deleted: true });
  },
};

export { reservationService };
