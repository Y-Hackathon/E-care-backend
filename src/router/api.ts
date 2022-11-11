import express, { Request, Response } from 'express';
import firebaseAdmin from '../firebase';
// import { getFirestore } from 'firebase-admin/firestore';

const router = express.Router();

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

router.post('/hello/world', (req: any, res: any) => {
	console.log(`Hello world!`);

	res.status(200).send();
});

export default router;
