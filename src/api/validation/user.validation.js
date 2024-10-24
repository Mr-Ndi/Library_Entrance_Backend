import Joi from "joi";

const regNo = Joi.number().required().custom( (value, helpers) => {
    const regNo = value.toString();
    const regex = /^22\d{7}$/;

    if (!regex.test(regNo))
        return helpers.message("Registration number must start with 22 and be 9 digits");
    return 0;
});

const userSchema = Joi.object({
    regNo,
    firstName: Joi.string().min(2).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'Names must be at least 2 characters long'
    }),
    otherName: Joi.string().min(2).required().messages({
        'string.empty': 'Last name is required',
        'string.min': 'Names must be at least 2 characters long'
    }),
    department: Joi.string().required().messages({
        'string.empty': 'Department is required'
    }),
    level: Joi.number().min(1).max(6).required().messages({
        'number.base': 'Level must be between 1 and 6',
        'number.min': 'Level must be between 1 and 6',
        'number.max': 'Level must be between 1 and 6',
        'any.required': 'Level is required'
    }),
    gender: Joi.string().valid("male", "female").required().messages({
        'any.only': 'Gender must be either male or female',
        'any.required': 'Gender is required'
    })
});

export {
    userSchema,
    regNo
};
