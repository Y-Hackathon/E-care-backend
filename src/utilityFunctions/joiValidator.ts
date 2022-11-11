import { StatusCodes } from 'http-status-codes';

const { UNPROCESSABLE_ENTITY } = StatusCodes;

const validator = ({ schema, requestProperty }: any) => {
	return (req: any, res: any, next: any) => {
		const { error } = schema.validate(req[requestProperty]);

		if (!error) {
			return next();
		} else {
			const { details } = error as { details: any[] };
			const message = details.map(i => i.message).join(',');
			console.log(`validationError: ${message}`);

			return res.status(UNPROCESSABLE_ENTITY).send({
				data: message,
				message: 'BAD REQUEST',
				status: UNPROCESSABLE_ENTITY,
			});
		}
	};
};

export default validator;
