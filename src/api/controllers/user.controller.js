import httpStatus from "http-status";
import { registerUser } from "../../services/user.service.js";

const requestSession = (req, res) => {
    const {reg} = req.params;

    if (!reg) {
        return res.status(400).json({ message: "Registration number is required." });
    }

    const responseMessage = `Session was guaranteed for student with registration number: ${reg}`;
    
    return res.status(200).json({ message: responseMessage });
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

    if ( added?.status === 0 )
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(added);
    return res.status(httpStatus.OK).json(added);
}

export default {
    requestSession,
    addUser
};