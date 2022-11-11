import express from 'express';

import ValidationSchema from './validationSchema';
import { appointments } from '../controllers';
import { joiValidator } from '../utilityFunctions';

const router = express.Router({ caseSensitive: true });
const { fetchAppointmentById, fetchAppointments } = appointments.fetch;
const { createAppointment } = appointments.create;

const { fetchAppointmentSchema, createAppointmentSchema } = ValidationSchema;

// Fetch endpoints
router.get('/fetch', fetchAppointments);
router.get('/fetch/:appointmentId', joiValidator(fetchAppointmentSchema), fetchAppointmentById);

// Create endpoints
router.post('/create', joiValidator(createAppointmentSchema), createAppointment);

export default router;
