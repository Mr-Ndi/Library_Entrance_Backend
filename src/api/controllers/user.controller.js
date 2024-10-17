import httpStatus from "http-status";
import { registerUser } from "../../services/user.service.js";
import { findUser, recordAttendance } from "../../services/user.service.js";

const requestSession = async (req, res) => {
    const { reg } = req.params;
    // console.log(`Received registration number: ${reg}`);

    if (!reg) {
        return res.status(400).json({ message: "Registration number is required." });
    }

    try {
        const result = await findUser(reg);
      
        if (!result.success) {
            if (result.user === null) {
                return res.status(404).json({ message: "User not found.", success: false });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
            }
        }

        const { _id,__v, ...formattedUser } = result.user.toObject();
        const recorded = await recordAttendance(reg)
        
        return res.status(200).json({...formattedUser, ...recorded});
        
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error." });
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