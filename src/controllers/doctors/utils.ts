import dayjs from 'dayjs';

import { DOCTORS_SERVICE } from './constants';
import { GenerateDoctorData } from './types';

export const generateDoctorData: GenerateDoctorData = baseData => {
	const { doctorId, ...remainingBaseData } = baseData;
	const nowTimestamp = dayjs().unix();

	return {
		...remainingBaseData,
		isArchived: false,
		isSuspended: false,
		createdAt: nowTimestamp,
		updatedAt: nowTimestamp,
		updatedBy: DOCTORS_SERVICE,
		patientCount: 0,
		profilePhotoUrl: '',
		rating: 5,
		doctorId,
		id: doctorId,
	};
};
