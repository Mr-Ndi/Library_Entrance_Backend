import httpStatus from "http-status";
import { registerUser } from "../../services/user.service.js";
import { findUser } from "../../services/user.service.js";

const requestSession = async (req, res) => {
    const { reg } = req.params;

    // Step 1: Validate the Registration Number
    if (!reg) {
        return res.status(400).json({ message: "Registration number is required." });
    }
    // // Check if reg is a valid number
    // const regNumber = Number(reg);
    // if (isNaN(regNumber)) {
    //     return res.status(400).json({ message: "Registration number must be a valid number." });
    // }
    
    try {
        const result = await findUser(reg)
      
        if (result === null) {
            return res.status(204).json({ message: "User not found.", success: false });
        }
        if(result?.status === false) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
        }
        return res.status(200).json(result)
        // // Step 2: Check User Existence in Database
        // const user = await User.findOne({ regNo: regNumber });

        // if (!user) {
        //     return res.status(404).json({ message: "User not found.", success: false });
        // }

        // const responseMessage = `Session was guaranteed for student with registration number: ${reg}`;
        
        // return res.status(200).json({ message: responseMessage, success: true });

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