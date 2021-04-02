import Joi from '@hapi/joi'

const mailValidaion = (mail: any) => {
    const schema = Joi.object({
		name: Joi.string().required(),
		recieverEmail: Joi.string().email().required(),
		message: Joi.string().required(),
	});

    return schema.validate(mail);
}

export default mailValidaion;