import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { filter, paginate, sort } from './filters';
import { Reservation } from '../types/propertyAPI/Reservation';
import { ReservationId } from '../types/propertyAPI/ReservationId';
import { Reservations } from '../types/propertyAPI/Reservations';
import { Query } from '../types/propertyAPI/Query';
import { DeleteReservationResponse } from '../types/propertyAPI/DeleteReservationResponse';

const reservationsFilePath = 'data/reservation.json';
const reservations: Reservation[] = JSON.parse(fs.readFileSync(reservationsFilePath, 'utf8'));

const getNextId = (items: Reservation[]): number => {
  return items.length > 0 ? Math.max(...items.map(item => item.id).filter(id => id !== undefined)) + 1 : 1;
};

const reservationService = {
  readReservation: (call: grpc.ServerUnaryCall<ReservationId, Reservation>, callback: grpc.sendUnaryData<Reservation>): void => {
    const reservationId = call.request.id;
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      callback(null, reservation);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Reservation not found"
      });
    }
  },
  readReservations: (
    call: grpc.ServerUnaryCall<Query, Reservations>, 
    callback: grpc.sendUnaryData<Reservations>
  ): void => {
    const startDate = reservations.date.start ? new Date(reservations.date.start) : undefined;
const endDate = reservations.date.end ? new Date(reservations.date.end) : undefined;
    let result = [...reservations].map(reservation => ({
      ...reservation,
      date: reservation.date ? {
        start: reservation.date.start ? new Date(reservation.date.start) : undefined,
        end: reservation.date.end ? new Date(reservation.date.end) : undefined
      } : undefined,
    }));
  
    if (call.request.filters) {
      result = filter(result, call.request.filters);
    }
    if (call.request.sorts) {
      result = sort(result, call.request.sorts);
    }
    if (call.request.pagination) {
      result = paginate(result, call.request.pagination);
    }
    return callback(null, { reservations: result });
  },
  createReservation: (call: grpc.ServerUnaryCall<Reservation, Reservation>, callback: grpc.sendUnaryData<Reservation>): void => {
    const data = call.request;
    const newReservationData: Reservation = { ...data, id: getNextId(reservations) };
    reservations.push(newReservationData);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
    return callback(null, newReservationData);
  },
  updateReservation: (call: grpc.ServerUnaryCall<Reservation, Reservation>, callback: grpc.sendUnaryData<Reservation>): void => {
    const reservationInfo = call.request;
    const reservationIndex = reservations.findIndex(r => r.id === reservationInfo.id);
    if (reservationIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a reservation with the specified ID to update"
      });
    }
    const selectedReservation = reservations[reservationIndex];
    const updatedReservation: Reservation = {
      id: selectedReservation.id,
      propertyId: reservationInfo.propertyId ?? selectedReservation.propertyId,
      clientId: reservationInfo.clientId ?? selectedReservation.clientId,
      date: reservationInfo.date ?? selectedReservation.date
    };
    reservations.splice(reservationIndex, 1, updatedReservation);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
    return callback(null, updatedReservation);
  },
  deleteReservation: (call: grpc.ServerUnaryCall<ReservationId, DeleteReservationResponse>, callback: grpc.sendUnaryData<DeleteReservationResponse>): void => {
    const reservationId = call.request.id;
    const reservationIndex = reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a reservation with the specified ID to delete"
      });
    }
    reservations.splice(reservationIndex, 1);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
    return callback(null, { deleted: true });
  }
};

export { reservationService };