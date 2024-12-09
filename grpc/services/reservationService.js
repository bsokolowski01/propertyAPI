import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { filter, paginate, sort } from './filters.js';

const reservationsFilePath = 'data/reservation.json';
const reservations = JSON.parse(fs.readFileSync(reservationsFilePath, 'utf8'));

const getNextId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };

const reservationService = {
  readReservation: (call, callback) => {
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
  readReservations: (call, callback) => {
    let result = [...reservations];
    
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
  createReservation: (call, callback) => {
    const data = call.request;
    const newReservationData = { ...data, id: getNextId(reservations) };
    reservations.push(newReservationData);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
    return callback(null, newReservationData);
  },
  updateReservation: (call, callback) => {
    const reservationInfo = call.request;
    const reservationIndex = reservations.findIndex(r => r.id === reservationInfo.id);
    if (reservationIndex === -1) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "Could not find a reservation with the specified ID to update"
      });
    }
    const selectedReservation = reservations[reservationIndex];
    const updatedReservation = {
      id: selectedReservation.id,
      propertyId: reservationInfo.propertyId ?? selectedReservation.propertyId,
      clientId: reservationInfo.clientId ?? selectedReservation.clientId,
      startDate: reservationInfo.startDate ?? selectedReservation.startDate,
      endDate: reservationInfo.endDate ?? selectedReservation.endDate
    };
    reservations.splice(reservationIndex, 1, updatedReservation);
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
    return callback(null, updatedReservation);
  },
  deleteReservation: (call, callback) => {
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