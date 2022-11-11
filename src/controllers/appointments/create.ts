import { StatusCodes } from 'http-status-codes';

import firebaseAdmin from '../../firebase';
import { generateUUID, getTimestamp } from '../../utilityFunctions';
import { CreateAppointmentReqData } from './types';
// import { generateAppointmentData } from './utils';

const { firestore } = firebaseAdmin;
const { CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

const Create = {
	async createAppointment(req: any, res: any): Promise<any> {
		const createAppointmentReqData: CreateAppointmentReqData = req.body;

		const { userId, doctorId } = createAppointmentReqData;

		try {
			// create appointment on firebase authentication
			const [userSnapshot, doctorSnapshot] = await Promise.all([
				firestore.collection('users').doc(userId).get(),
				firestore.collection('doctors').doc(doctorId).get(),
			]);

			if (!userSnapshot.exists) {
				return res.status(BAD_REQUEST).send({
					data: null,
					message: 'User not found',
					status: 'APPOINTMENTS_NOT_FOUND',
				});
			}

			if (!doctorSnapshot.exists) {
				return res.status(BAD_REQUEST).send({
					data: null,
					message: 'Doctor not found',
					status: 'DOCTOR_NOT_FOUND',
				});
			}

			const nowTimestamp = getTimestamp();
			const appointmentId = generateUUID();

			const appointmentData = {
				...createAppointmentReqData,
				isArchived: false,
				createdAt: nowTimestamp,
				meetingUrl: 'https://meet.google.com/jbv-aabr-ypy',
				status: 'PENDING',
				updatedAt: nowTimestamp,
				updatedBy: 'APPOINTMENTS_SERVICE',
				appointmentId,
				id: appointmentId,
			};

			await firestore.collection('appointments').doc(appointmentId).create(appointmentData);

			return res.status(CREATED).send({
				data: {
					appointment: appointmentData,
				},
				message: 'Appointment created successfully',
				status: 'APPOINTMENT_CREATED_SUCCESSFULLY',
			});
		} catch (error) {
			console.log(error, 'ERROR_CREATING_APPOINTMENT');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error creating appointment',
				status: 'ERROR_CREATING_APPOINTMENT',
			});
		}
	},
};

export default Create;
