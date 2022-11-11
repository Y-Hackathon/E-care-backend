import { StatusCodes } from 'http-status-codes';
import {
	createUserWithEmailAndPassword,
	initializeAuth,
	signInWithEmailAndPassword,
} from 'firebase/auth';

import firebaseAdmin from '../../firebase';
import { CreateUserReqData, IUser, UserSignInReqData } from './types';
import { generateUserData } from './utils';
import { FORBIDDEN_MESSAGE } from './constants';

const { auth, firestore, firebaseApp } = firebaseAdmin;
const { CREATED, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, BAD_REQUEST } = StatusCodes;

const Create = {
	async createUser(req: any, res: any): Promise<any> {
		const createAdminReqData: CreateUserReqData = req.body;

		const { password, ...passwordFreeData } = createAdminReqData;
		const { email } = createAdminReqData;

		const firebaseAuth = initializeAuth(firebaseApp);

		try {
			// create user on firebase authentication
			const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

			// create user on firestore and create custom claims
			if (user) {
				const { uid: userId } = user;

				const userData = generateUserData({
					...passwordFreeData,
					userId,
				});

				const [token] = await Promise.all([
					user.getIdToken(),
					firestore.collection('users').doc(userId).create(userData),
					auth.setCustomUserClaims(userId, passwordFreeData),
				]);

				return res.status(CREATED).send({
					data: {
						token,
						userId,
					},
					message: 'User created successfully',
					status: 'USER_CREATED_SUCCESSFULLY',
				});
			}

			// return error response if user is not created
			console.log('ERROR_CREATING_USER');

			return res.status(BAD_REQUEST).send({
				data: null,
				message: 'Error creating user',
				status: 'ERROR_CREATING_USER',
			});
		} catch (error) {
			console.log(error, 'ERROR_CREATING_USER');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error creating user',
				status: 'ERROR_CREATING_USER',
			});
		}
	},
	async signInUser(req: any, res: any): Promise<any> {
		const { body } = req;
		const createAdminReqData: UserSignInReqData = body;
		const { email, password } = createAdminReqData;

		const firebaseAuth = initializeAuth(firebaseApp);

		try {
			// sign in user on firebase authentication
			const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);

			// check if user exists and is an admin and not a suspended admin
			if (!user) {
				// return error response if user is not created
				console.log('ERROR_SIGNING_IN; User does not exists');

				return res.status(FORBIDDEN).send({
					data: null,
					message: 'Error signing in user',
					status: 'ERROR_SIGNING_IN',
				});
			}

			const { uid: userId } = user;

			const [token, userSnapshot] = await Promise.all([
				user.getIdToken(),
				firestore.collection('users').doc(userId).get(),
			]);

			if (!userSnapshot.exists) {
				return res.status(FORBIDDEN).send({
					data: null,
					message: 'You are not authorized',
					status: 'FORBIDDEN_REQUEST',
				});
			}

			const { isSuspended, isArchived } = userSnapshot.data() as IUser;

			if (isSuspended || isArchived) {
				console.log('FORBIDDEN: You are not authorized to sign in');

				return res.status(FORBIDDEN).send({
					data: null,
					message: FORBIDDEN_MESSAGE,
					status: 'FORBIDDEN_REQUEST',
				});
			}

			return res.status(OK).send({
				data: { userId, token },
				message: 'User signed in successfully',
				status: 'USER_SIGNED_IN_SUCCESSFULLY',
			});
		} catch (error) {
			console.error(error, `ERROR_SIGNING_IN_ADMIN_USER: ${email}`);

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error signing in admin user',
				status: 'ERROR_SIGNING_IN_ADMIN_USER',
			});
		}
	},
};

export default Create;
