import { object, string, number } from 'joi';
import { RequestProperty } from '../types';

const ValidationSchema = {
	createAppointmentSchema: {
		schema: object().keys({
			userId: string().required().trim(),
			doctorId: string().required().trim(),
			patientNotes: string().required().trim(),
			appointmentDate: number().required(),
		}),
		requestProperty: RequestProperty.BODY,
	},
	fetchAppointmentSchema: {
		schema: object().keys({
			appointmentId: string().required().trim(),
		}),
		requestProperty: RequestProperty.PARAMS,
	},
	createDoctorSchema: {
		schema: object().keys({
			firstName: string().required().trim(),
			lastName: string().required().trim(),
			password: string().required().trim(),
			specialty: string().required().trim(),
			email: string().email().required(),
			dateOfBirth: number().required(),
			inductionDate: number().required(),
			gender: string().required().valid('MALE', 'FEMALE'),
			phoneNumber: string().required().min(10).max(13),
		}),
		requestProperty: RequestProperty.BODY,
	},
	fetchDoctorSchema: {
		schema: object().keys({
			doctorId: string().required().trim(),
		}),
		requestProperty: RequestProperty.PARAMS,
	},
	signInDoctorSchema: {
		schema: object().keys({
			email: string().email().required(),
			password: string().required().trim(),
		}),
		requestProperty: RequestProperty.BODY,
	},
	createUserSchema: {
		schema: object().keys({
			firstName: string().required().trim(),
			lastName: string().required().trim(),
			password: string().required().trim(),
			email: string().email().required(),
			dateOfBirth: number().required(),
			gender: string().required().valid('MALE', 'FEMALE'),
			phoneNumber: string().required().min(10).max(13),
		}),
		requestProperty: RequestProperty.BODY,
	},
	fetchUserSchema: {
		schema: object().keys({
			userId: string().required().trim(),
		}),
		requestProperty: RequestProperty.PARAMS,
	},
	signInUserSchema: {
		schema: object().keys({
			email: string().email().required(),
			password: string().required().trim(),
		}),
		requestProperty: RequestProperty.BODY,
	},
};

export default ValidationSchema;
