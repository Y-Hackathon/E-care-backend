import supertest from 'supertest';

import app from '../src/app';

describe('Service', () => {
	describe('GET / ', () => {
		it('should start successfully', async () => {
			await supertest(app).get('/').expect(200);
		});
	});
});
