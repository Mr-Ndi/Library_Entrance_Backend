import httpStatus from 'http-status';

const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err; 
    if (!statusCode) {
        console.error(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Server error"
        });
    }

    return res.status(statusCode).json({
        success:false,
        message
    });
}

export default errorHandler;