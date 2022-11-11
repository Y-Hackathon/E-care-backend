import { nanoid } from 'nanoid';
import { getTimestamp } from '../../utilityFunctions';

import { APPOINTMENTS_SERVICE, MEETING_URL } from './constants';
import { AppointmentStatus, GenerateAppointmentData } from './types';

export const generateAppointmentData: GenerateAppointmentData = baseData => {
	const nowTimestamp = getTimestamp();
	const appointmentId = nanoid();

	return {
		...baseData,
		isArchived: false,
		createdAt: nowTimestamp,
		meetingUrl: MEETING_URL,
		status: AppointmentStatus.PENDING,
		updatedAt: nowTimestamp,
		updatedBy: APPOINTMENTS_SERVICE,
		appointmentId,
		id: appointmentId,
	};
};
