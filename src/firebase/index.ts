import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

import config from '../config';

const { adminConfig, firebaseConfig } = config;
const { apiKey, authDomain, messagingSenderId, databaseURL, storageBucket } = firebaseConfig;

admin.initializeApp({
	credential: admin.credential.cert(adminConfig),
	databaseURL,
	storageBucket,
});

let firebaseApp = initializeApp({
	apiKey,
	authDomain,
	databaseURL,
	messagingSenderId,
	storageBucket,
}) as any;

if (!firebaseApp) {
	firebaseApp = initializeApp(firebaseApp.options);
}

const firebaseAuth = initializeAuth(firebaseApp);

export default {
	auth: admin.auth(),
	firestore: admin.firestore(),
	firebaseApp,
	firebaseAuth,
};
