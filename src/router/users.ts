import express from 'express';

import ValidationSchema from './validationSchema';
import { users } from '../controllers';
import { joiValidator } from '../utilityFunctions';

const router = express.Router({ caseSensitive: true });
const { fetchUsers, fetchUserById } = users.fetch;

const { fetchUserSchema } = ValidationSchema;

// Fetch endpoints
router.get('/fetch', fetchUsers);
router.get('/fetch/:userId', joiValidator(fetchUserSchema), fetchUserById);

export default router;
