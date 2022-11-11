import express from 'express';

import api from './api';
import messages from './messages';

const router = express.Router({ caseSensitive: true });

router.use('/api/v1', api);
router.use('/message', messages);

export default router;
