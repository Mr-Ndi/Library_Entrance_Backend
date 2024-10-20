import httpStatus from 'http-status'; 
import { isValidTicket } from '../../services/history.service.js';

const validateRecord = async (req, res, next) => {
    const {ticketId} = req.params;

    if (!ticketId)
        return res.status(httpStatus.BAD_REQUEST).json({success:false, message:"Ticket Id is required"});
    try {
        const valid = await isValidTicket(ticketId);
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