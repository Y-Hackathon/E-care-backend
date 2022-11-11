import express from 'express';
import firebaseAdmin from '../firebase';

import usersRoute from './users';
import doctorsRoute from './doctors';
import appointmentsRoute from './appointments';
import ValidationSchema from './validationSchema';
import { users, doctors } from '../controllers';
import { joiValidator } from '../utilityFunctions';

const router = express.Router({ caseSensitive: true });
const { createUser, signInUser } = users.create;
const { createDoctor, signInDoctor } = doctors.create;

const {
	createUserSchema,
	createDoctorSchema,
	signInUserSchema,
	signInDoctorSchema,
} = ValidationSchema;

router.put('/user/signin', joiValidator(signInUserSchema), signInUser);
router.post('/user/signup', joiValidator(createUserSchema), createUser);

router.put('/doctor/signin', joiValidator(signInDoctorSchema), signInDoctor);
router.post('/doctor/signup', joiValidator(createDoctorSchema), createDoctor);

const { auth, firestore } = firebaseAdmin;

router.get('/test', async (req: any, res: any) => {
	// firestore
	const usersSnapshot = await firestore.collection('users').get();
	if (!usersSnapshot.empty) {
		const users = usersSnapshot.docs.map(doc => doc.data());
		console.log(users);
	} else {
		console.log('Document data:');
	}
	res.send('OK');
});

/**
 * Leverage firebase authentication token to securtize the api endpoints.
 */
router.use(async (req: any, res: any, next: any) => {
	const { authorization } = req.headers;

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		const token = authorization.split(' ')[1];
		const decodedToken = await auth.verifyIdToken(token);
		const { uid } = decodedToken;

		if (uid) {
			next();
		}
	} else {
		res.sendStatus(401);
	}
});

router.use('/users', usersRoute);
router.use('/doctors', doctorsRoute);
router.use('/appointments', appointmentsRoute);

export default router;
