import { object, string } from 'joi';
import { RequestProperty } from '../types';

const ValidationSchema = {
	createUserSchema: {
		schema: object().keys({
			firstName: string().required().trim(),
			lastName: string().required().trim(),
			password: string().required().trim(),
			email: string().email().required(),
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
