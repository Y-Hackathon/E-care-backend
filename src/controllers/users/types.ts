import { IAppointment } from '../appointments/types';

export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}

export interface IUser {
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
	updatedAt: number;
	updatedBy: string;
	userId: string;
	profilePhotoUrl?: string;
}

export interface IUserWithAppointment extends IUser {
	appointment?: IAppointment[];
}

export type BaseUser = {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	dateOfBirth: number;
	gender: Gender;
};

export type CreateUserReqData = BaseUser & {
	password: string;
};

export type GenerateUserData = (
	baseData: BaseUser & {
		userId: string;
	}
) => IUser;

export type UserSignInReqData = {
	email: string;
	password: string;
};
