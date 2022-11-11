export type Address = {
	addressId: string;
	addressOwnerType: string;
	addressOwnerId: string;
	city: string;
	country: string;
	createdAt: number;
	id: string;
	street: string;
	state: string;
	zipCode?: string;
	updatedAt: number;
	updatedBy: string;
};

export enum RequestProperty {
	BODY = 'body',
	QUERY = 'query',
	PARAMS = 'params',
}
