import mock from 'mock-require';
import sinon from 'sinon';
import { assert } from 'console';

const publishSpy = sinon.fake.returns('test-message-id');
const topicFake = sinon.fake.returns({
	publish: publishSpy,
});

mock('@google-cloud/pubsub', {
	PubSub: class {
		topic = topicFake;
	},
});

import publishMessage from '../src/pubsub/publishMessage';

describe('PubSub', () => {
	describe('Publish Message', () => {
		it('should publish message to the topic', async () => {
			const payload = {
				data: 'Hello World',
				topic: 'test-topic',
			};

			const messageId = await publishMessage(payload);

			assert(topicFake.called);
			assert(publishSpy.called);

			assert(messageId === 'test-message-id');
		});
	});
});
