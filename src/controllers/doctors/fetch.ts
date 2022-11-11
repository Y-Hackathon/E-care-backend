import { StatusCodes } from 'http-status-codes';

import firebaseAdmin from '../../firebase';
import { IDoctor } from './types';

const { firestore } = firebaseAdmin;
const { OK, INTERNAL_SERVER_ERROR, FORBIDDEN } = StatusCodes;

const Fetch = {
	async fetchDoctors(req: any, res: any): Promise<any> {
		try {
			// create doctor on firebase authentication
			const doctorsSnapshot = await firestore.collection('doctors').get();

			if (doctorsSnapshot.empty) {
				return res.status(OK).send({
					data: [],
					message: 'No doctors found',
					status: 'NO_DOCTORS_FOUND',
				});
			}

			const doctors: IDoctor[] = doctorsSnapshot.docs.map(doc => doc.data() as IDoctor);

			return res.status(OK).send({
				data: {
					doctors,
				},
				message: 'Fetched Doctors successfully',
				status: 'DOCTOR_FETCHED_SUCCESSFULLY',
			});
		} catch (error) {
			console.log(error, 'ERROR_FETCHING_DOCTOR');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching doctor',
				status: 'ERROR_FETCHING_DOCTOR',
			});
		}
	},
	async fetchDoctorById(req: any, res: any): Promise<any> {
		const { params } = req;
		const { doctorId = '' } = params as { doctorId: string };

		try {
			// sign in doctor on firebase authentication
			const doctorSnapshot = await firestore.collection('doctors').doc(doctorId).get();

			// check if doctor exists and is an admin and not a suspended admin
			if (!doctorSnapshot.exists) {
				// return error response if doctor is not created
				console.log('ERROR_FETCHING_DOCTOR_DETAILS; Doctor does not exists');

				return res.status(FORBIDDEN).send({
					data: null,
					message: 'Error fetching doctor details',
					status: 'ERROR_FETCHING_DOCTOR_DETAILS; Doctor does not exists',
				});
			}

			const doctor = doctorSnapshot.data() as IDoctor;

			return res.status(OK).send({
				data: { doctor },
				message: 'Doctor details retrieved successfully',
				status: 'DOCTOR_DETAILS_RETRIEVED_SUCCESSFULLY',
			});
		} catch (error) {
			console.error(error, `ERROR_FETCHING_DOCTOR_DETAILS`);

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching doctor details',
				status: 'ERROR_FETCHING_DOCTOR_DETAILS',
			});
		}
	},
};

export default Fetch;
