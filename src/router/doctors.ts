import express from 'express';

import ValidationSchema from './validationSchema';
import { doctors } from '../controllers';
import { joiValidator } from '../utilityFunctions';

const router = express.Router({ caseSensitive: true });
const { fetchDoctors, fetchDoctorById } = doctors.fetch;

const { fetchDoctorSchema } = ValidationSchema;

// Fetch endpoints
router.get('/fetch', fetchDoctors);
router.get('/fetch/:doctorId', joiValidator(fetchDoctorSchema), fetchDoctorById);

export default router;
