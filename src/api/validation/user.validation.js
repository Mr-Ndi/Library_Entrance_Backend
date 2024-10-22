import Joi from "joi";

const regNo = Joi.number().required().max(999999999).min(100000000);

const userSchema = Joi.object({
    regNo,
    firstName: Joi.string().required(),
    otherName: Joi.string().required(),
    department: Joi.string().required(),
    level: Joi.number().required(),
    gender: Joi.string().valid("male","female").required()
});

export{
    userSchema,
    regNo
}