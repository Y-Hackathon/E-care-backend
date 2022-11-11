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
	updatedAt: number;
	updatedBy: string;
	profilePhotoUrl?: string;
}

export type BaseUser = {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	dateOfBirth: number;
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
