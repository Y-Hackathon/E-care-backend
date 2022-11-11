export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}

export interface IDoctor {
	addressId?: string;
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isSuspended: boolean;
	isArchived: boolean;
	phoneNumber: string;
	createdAt: number;
	dateOfBirth: number;
	gender: Gender;
	inductionDate: number;
	patientCount?: number;
	specialty: string;
	doctorId: string;
	updatedAt: number;
	updatedBy: string;
	profilePhotoUrl?: string;
}

export type BaseDoctor = {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	gender: Gender;
	dateOfBirth: number;
	inductionDate: number;
	specialty: string;
};

export type CreateDoctorReqData = BaseDoctor & {
	password: string;
};

export type GenerateDoctorData = (
	baseData: BaseDoctor & {
		doctorId: string;
	}
) => IDoctor;

export type DoctorSignInReqData = {
	email: string;
	password: string;
};
