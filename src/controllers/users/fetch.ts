import { StatusCodes } from 'http-status-codes';

import firebaseAdmin from '../../firebase';
import { IUser } from './types';

const { firestore } = firebaseAdmin;
const { OK, INTERNAL_SERVER_ERROR, FORBIDDEN } = StatusCodes;

const Fetch = {
	async fetchUsers(req: any, res: any): Promise<any> {
		try {
			// create user on firebase authentication
			const usersSnapshot = await firestore.collection('users').get();

			if (usersSnapshot.empty) {
				return res.status(OK).send({
					data: [],
					message: 'No users found',
					status: 'NO_USERS_FOUND',
				});
			}

			const users: IUser[] = usersSnapshot.docs.map(doc => doc.data() as IUser);

			return res.status(OK).send({
				data: {
					users,
				},
				message: 'Fetched Users successfully',
				status: 'USER_FETCHED_SUCCESSFULLY',
			});
		} catch (error) {
			console.log(error, 'ERROR_FETCHING_USER');

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching user',
				status: 'ERROR_FETCHING_USER',
			});
		}
	},
	async fetchUserById(req: any, res: any): Promise<any> {
		const { params } = req;
		const { userId = '' } = params as { userId: string };

		try {
			// sign in user on firebase authentication
			const userSnapshot = await firestore.collection('users').doc(userId).get();

			// check if user exists and is an admin and not a suspended admin
			if (!userSnapshot.exists) {
				// return error response if user is not created
				console.log('ERROR_FETCHING_USER_DETAILS; User does not exists');

				return res.status(FORBIDDEN).send({
					data: null,
					message: 'Error fetching user details',
					status: 'ERROR_FETCHING_USER_DETAILS; User does not exists',
				});
			}

			const user = userSnapshot.data() as IUser;

			return res.status(OK).send({
				data: { user },
				message: 'User details retrieved successfully',
				status: 'USER_DETAILS_RETRIEVED_SUCCESSFULLY',
			});
		} catch (error) {
			console.error(error, `ERROR_FETCHING_USER_DETAILS`);

			return res.status(INTERNAL_SERVER_ERROR).send({
				data: null,
				message: 'Error fetching user details',
				status: 'ERROR_FETCHING_USER_DETAILS',
			});
		}
	},
};

export default Fetch;
