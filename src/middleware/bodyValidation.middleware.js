import httpStatus from 'http-status';

const bodyValidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if ( error )
            return res.status(httpStatus.BAD_REQUEST).json({
                success:false,
                message:error.details[0].message
            });
        
        next();
    }
};

export default bodyValidator;