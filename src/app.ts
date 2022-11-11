import bodyParser from 'body-parser';
import express from 'express';

import router from './router';

const app = express();

app.use(bodyParser.json());
app.use(router);

export default app;
