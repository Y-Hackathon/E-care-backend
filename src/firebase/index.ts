import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';

import config from '../config';

const { adminConfig, firebaseConfig } = config;
const { apiKey, authDomain, messagingSenderId, databaseURL, storageBucket } = firebaseConfig;

admin.initializeApp({
	credential: admin.credential.cert(adminConfig),
	databaseURL,
	storageBucket,
});

const firebaseApp = initializeApp({
	apiKey,
	authDomain,
	databaseURL,
	messagingSenderId,
	storageBucket,
});

export default {
	auth: admin.auth(),
	firestore: admin.firestore(),
	firebaseApp,
};
