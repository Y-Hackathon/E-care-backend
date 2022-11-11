import { PubSub } from '@google-cloud/pubsub';

import { PublishMessagePayload } from './types';

const pubSubClient = new PubSub();

export default async function publishMessage(payload: PublishMessagePayload): Promise<string> {
	const { data, topic } = payload;
	const dataBuffer = Buffer.from(data);

	/**
	 * These is a non-zero chance that messages will be sent more than once
	 * to a subscriber.
	 *
	 * TODO: leverage the messageId to assure idempotent operations
	 */
	const messageId = await pubSubClient.topic(topic).publish(dataBuffer);
	console.log(`Message ${messageId} published.`);

	return messageId;
}
