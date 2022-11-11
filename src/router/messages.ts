import express, { Request, Response } from 'express';

const router = express.Router();

router.use((req: any, res: any, next: any) => {
	if (!req.body) {
		const msg = 'no Pub/Sub message received';
		console.error(`error: ${msg}`);
		res.status(400).send(`Bad Request: ${msg}`);

		return;
	}

	if (!req.body.message) {
		const msg = 'invalid Pub/Sub message format';
		console.error(`error: ${msg}`);
		res.status(400).send(`Bad Request: ${msg}`);

		return;
	}

	if (req.body.message.data) {
		const pubSubMessage = Buffer.from(req.body.message?.data, 'base64').toString();
		req.body = JSON.parse(pubSubMessage);
	}

	next();
});

/**
 * Make sure to setup your Topics and subscription.
 * Then give your service the appropriate permissions to receive messages.
 *
 * You should specify a different endpoint for different message types
 *
 * Reference - https://cloud.google.com/run/docs/triggering/pubsub-push#run_pubsub_handler-nodejs
 */

router.post('/hello/world', (req: any, res: any) => {
	const pubSubMessage = req.body;

	console.log(`Hello ${pubSubMessage}!`);

	res.status(204).send();
});

export default router;
