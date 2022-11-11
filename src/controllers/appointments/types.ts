export enum AppointmentStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
}

export interface IAppointment {
	appointmentDate: number;
	meetingUrl: string;
	id: string;
	appointmentId: string;
	patientNotes: string;
	status: AppointmentStatus;
	isArchived: boolean;
	userId: string;
	createdAt: number;
	updatedAt: number;
	updatedBy: string;
	doctorId: string;
}

export type BaseUser = {
	appointmentDate: number;
	patientNotes: string;
	userId: string;
	doctorId: string;
};

export type CreateAppointmentReqData = BaseUser;

export type GenerateAppointmentData = (baseData: BaseUser) => IAppointment;
