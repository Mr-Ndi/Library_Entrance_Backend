import httpStatus from 'http-status'; 
import { isValidRef } from '../../services/history.service.js';

const validateRecord = async (req, res, next) => {
    const {refId} = req.params;

    if (!refId)
        return res.status(httpStatus.BAD_REQUEST).json({success:false, message:"Reference Id is required"});
    try {
        const valid = await isValidRef(refId);
        return res.status(httpStatus.OK).json({
            success:true,
            ...valid
        });
    } catch (err) {
        next(err);
    }
}

export {
    validateRecord
}