import { StatusCodes } from 'http-status-codes';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import firebaseAdmin from '../../firebase';
import { CreateDoctorReqData, IDoctor, DoctorSignInReqData } from './types';
import { generateDoctorData } from './utils';
import { FORBIDDEN_MESSAGE } from './constants';

const { auth, firestore, firebaseAuth } = firebaseAdmin;
const { CREATED, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, BAD_REQUEST } = StatusCodes;

const Create = {
	async createDoctor(req: any, res: any): Promise<any> {
		const createAdminReqData: CreateDoctorReqData = req.body;

		const { password, ...passwordFreeData } = createAdminReqData;
		const { email } = createAdminReqData;

		try {
			// create doctor on firebase authentication
			const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

			// create doctor on firestore and create custom claims
			if (user) {
				const { uid: doctorId } = user;

				const doctorData = generateDoctorData({
					...passwordFreeData,
					doctorId,
				});

				const [token] = await Promise.all([
					user.getIdToken(),
					firestore.collection('doctors').doc(doctorId).create(doctorData),
					auth.setCustomUserClaims(doctorId, passwordFreeData),
				]);

				return res.status(CREATED).send({
					data: {
						token,
						doctorId,
					},
					message: 'Doctor created successfully',
					status: 'DOCTOR_CREATED_SUCCESSFULLY',
				});
			}

			// return error response if doctor is not created
			console.log('ERROR_CREATING_DOCTOR');

			return res.status(BAD_REQUEST).send({
				data: null,
				message: 'Error creating doctor',
				status: 'ERROR_CREATING_DOCTOR',
			});
		} catch (error) {
			console.log(error, 'ERROR_CREATING_DOCTOR');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error creating doctor',
				status: 'ERROR_CREATING_DOCTOR',
			});
		}
	},
	async signInDoctor(req: any, res: any): Promise<any> {
		const { body } = req;
		const createAdminReqData: DoctorSignInReqData = body;
		const { email, password } = createAdminReqData;

		try {
			// sign in doctor on firebase authentication
			const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);

			// check if doctor exists and is an admin and not a suspended admin
			if (!user) {
				// return error response if doctor is not created
				console.log('ERROR_SIGNING_IN; Doctor does not exists');

				return res.status(FORBIDDEN).send({
					data: null,
					message: 'Error signing in doctor',
					status: 'ERROR_SIGNING_IN',
				});
			}

			const { uid: doctorId } = user;

			const [token, doctorSnapshot] = await Promise.all([
				user.getIdToken(),
				firestore.collection('doctors').doc(doctorId).get(),
			]);

			if (!doctorSnapshot.exists) {
				return res.status(FORBIDDEN).send({
					data: null,
					message: 'You are not authorized',
					status: 'FORBIDDEN_REQUEST',
				});
			}

			const doctorData = doctorSnapshot.data() as IDoctor;
			const { isSuspended, isArchived } = doctorData;

			if (isSuspended || isArchived) {
				console.log('FORBIDDEN: You are not authorized to sign in');

				return res.status(FORBIDDEN).send({
					data: null,
					message: FORBIDDEN_MESSAGE,
					status: 'FORBIDDEN_REQUEST',
				});
			}

			return res.status(OK).send({
				data: { doctor: doctorData, token },
				message: 'Doctor signed in successfully',
				status: 'DOCTOR_SIGNED_IN_SUCCESSFULLY',
			});
		} catch (error) {
			console.error(error, `ERROR_SIGNING_IN_ADMIN_DOCTOR: ${email}`);

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error signing in admin doctor',
				status: 'ERROR_SIGNING_IN_ADMIN_DOCTOR',
			});
		}
	},
};

export default Create;
