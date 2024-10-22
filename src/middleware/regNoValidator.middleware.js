import httpStatus from 'http-status';

const regNoValidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params.reg);

        if ( error )
            return res.status(httpStatus.BAD_REQUEST).json({
                success:false,
                message:error.details[0].message
            });
        
        next();
    }
};
export {
    regNoValidator
}