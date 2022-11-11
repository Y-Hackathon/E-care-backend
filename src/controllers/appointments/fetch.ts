import { StatusCodes } from 'http-status-codes';

import firebaseAdmin from '../../firebase';
import { IAppointment } from './types';

const { firestore } = firebaseAdmin;
const { OK, INTERNAL_SERVER_ERROR, FORBIDDEN } = StatusCodes;

const Fetch = {
	async fetchAppointments(req: any, res: any): Promise<any> {
		try {
			// create appointment on firebase authentication
			const appointmentsSnapshot = await firestore.collection('appointments').get();

			if (appointmentsSnapshot.empty) {
				return res.status(OK).send({
					data: [],
					message: 'No appointments found',
					status: 'NO_APPOINTMENTS_FOUND',
				});
			}

			const appointments: IAppointment[] = appointmentsSnapshot.docs.map(
				doc => doc.data() as IAppointment
			);

			return res.status(OK).send({
				data: {
					appointments,
				},
				message: 'Fetched Appointments successfully',
				status: 'APPOINTMENT_FETCHED_SUCCESSFULLY',
			});
		} catch (error) {
			console.log(error, 'ERROR_FETCHING_APPOINTMENT');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching appointment',
				status: 'ERROR_FETCHING_APPOINTMENT',
			});
		}
	},
	async fetchAppointmentById(req: any, res: any): Promise<any> {
		const { params } = req;
		const { appointmentId = '' } = params as { appointmentId: string };

		try {
			// sign in appointment on firebase authentication
			const appointmentSnapshot = await firestore
				.collection('appointments')
				.doc(appointmentId)
				.get();

			// check if appointment exists and is an admin and not a suspended admin
			if (!appointmentSnapshot.exists) {
				// return error response if appointment is not created
				console.log('ERROR_FETCHING_APPOINTMENT_DETAILS; Appointment does not exists');

				return res.status(FORBIDDEN).send({
					data: null,
					message: 'Error fetching appointment details',
					status: 'ERROR_FETCHING_APPOINTMENT_DETAILS; Appointment does not exists',
				});
			}

			const appointment = appointmentSnapshot.data() as IAppointment;

			return res.status(OK).send({
				data: { appointment },
				message: 'Appointment details retrieved successfully',
				status: 'APPOINTMENT_DETAILS_RETRIEVED_SUCCESSFULLY',
			});
		} catch (error) {
			console.error(error, `ERROR_FETCHING_APPOINTMENT_DETAILS`);

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching appointment details',
				status: 'ERROR_FETCHING_APPOINTMENT_DETAILS',
			});
		}
	},
};

export default Fetch;
