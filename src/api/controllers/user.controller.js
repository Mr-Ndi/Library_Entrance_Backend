import httpStatus from "http-status";
import { buyTicket, registerUser } from "../../services/user.service.js";

const requestSession = async (req, res, next) => {
    const { reg } = req.params;
    try {
        const result = await buyTicket(reg);
        return res.status(httpStatus.OK).json({success: true, ...result});
    } catch (err){
        next(err)
    }
};

const addUser = async (req, res, next) => {
    const {
        regNo,
        level,
        firstName,
        otherName,
        department,
        gender
    } = req.body;
    const added = await registerUser({
        regNo,
        level,
        firstName,
        otherName,
        department,
        gender
    });

    if ( added?.success === false )
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(added);
    return res.status(httpStatus.OK).json({success:true, ...added});
}

export default {
    requestSession,
    addUser
};