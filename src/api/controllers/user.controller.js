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
    try {
        const registered = await registerUser({
            regNo,
            level,
            firstName,
            otherName,
            department,
            gender
        });      
        
        return res.status(httpStatus.CREATED).json({success:true, ...registered});
    } catch (err) {
        next(err);
    }
}

export default {
    requestSession,
    addUser
};