import dayjs from 'dayjs';

import { USERS_SERVICE } from './constants';
import { GenerateUserData } from './types';

export const generateUserData: GenerateUserData = baseData => {
	const { userId, ...remainingBaseData } = baseData;
	const nowTimestamp = dayjs().unix();

	return {
		...remainingBaseData,
		isArchived: false,
		isSuspended: false,
		createdAt: nowTimestamp,
		updatedAt: nowTimestamp,
		updatedBy: USERS_SERVICE,
		userId,
		id: userId,
	};
};
