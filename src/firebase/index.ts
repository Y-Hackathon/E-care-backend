import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

import config from '../config';

const { adminConfig } = config;

initializeApp({
	credential: admin.credential.cert(adminConfig),
	databaseURL: 'https://yassir-e-care-hacakton.firebaseio.com',
});

export default {
	auth: admin.auth(),
	firestore: admin.firestore(),
};
