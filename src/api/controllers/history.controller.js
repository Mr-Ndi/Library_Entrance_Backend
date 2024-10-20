import httpStatus from 'http-status'; 
import { checkRec } from '../../services/history.service.js';
import validateDate from '../../utils/dateValidator.js';

const validateRecord = async (req, res) => {
    const {refId} = req.params;

    if (!refId)
        return res.status(httpStatus.BAD_REQUEST).json({success:false, message:"Reference Id is required"});
    try {
        const record = await checkRec(refId);
    
        if (!record)
            return res.status(httpStatus.NOT_FOUND).json({success:false, message:"Record not found."});

        const valid = validateDate(record._id.getTimestamp());

        return res.status(httpStatus.OK).json({
            success:true,
            valid
        })
        
    } catch (err) {
        console.error("Server error:", err.stack);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Server error'})
    }
}

export {
    validateRecord
}