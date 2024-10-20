import {User} from '../api/models/user.model.js';
import { History } from '../api/models/history.model.js';
import AppError from '../errors.js';
import dataFormatter from '../utils/dataFormatter.js';
import ticketIdGenerator from '../utils/ticketIdGenerator.js';
import { userHasTicket } from './history.service.js';

const registerUser = async (inputs) => {
    const {regNo, firstName, otherName, department, level, gender} = inputs;
    try {

        const foundUser =  await findUser(regNo);

        // Recording attendance if user exists
        if (foundUser?.success === true) {
            const {_id, ...idRemoved} = dataFormatter(foundUser.user);
            const recorded = await recordAttendance(idRemoved.regNo);
            return (recorded?.success === false)?
                recorded : {...idRemoved, ...recorded}

        }

        // If error occured in finding user we return error
        if (foundUser?.success === false && Object.hasOwn(foundUser, "message"))
            return foundUser;

        // Creating new user if not found
        const newUser = new User(inputs);
        const registered = await newUser.save();
        const {_id, ...formattedUser} = dataFormatter(registered);

        // Recording new user attendance
        const recorded = await recordAttendance(formattedUser.regNo);
        return (recorded?.success === false)?
            recorded : {...formattedUser, ...recorded}

    } catch (err) {
        console.error("Server error!!??:",err.stack);
        return {
            message:"Server error",
            success:false
        }      
    }
}

const recordAttendance = async (regNmbr) => {
    const record = new History({
        regNo:regNmbr,
        ticketId:ticketIdGenerator(regNmbr)
    });

    try {

        const hasTicket = await userHasTicket(regNmbr);

        if (hasTicket)
            throw new AppError("User has ticket", 400);

        const recorded = await record.save();
        const recordedAt = recorded._id.getTimestamp();
        const {_id : refId, ...rest} = dataFormatter(recorded);
        return  {...rest, recordedAt};
    } catch (err) {
        console.error("Server error!!??:",err.stack);
        return {
            message:"Server error",
            success:false
        }        
    }
}

const findUser = async (regNmbr) => {
    try {
        // console.log(`Searching for user with regNo: ${regNmbr}`);
        
        const foundUser = await User.findOne({
            regNo: Number(regNmbr)
        });

        if (!foundUser) {
            console.log(`No user found with regNo: ${regNmbr}`);
            return { user: null, success: false };
        }

        // console.log(`Found user: ${JSON.stringify(foundUser)}`);
        return { user: foundUser, success: true };
    } catch (err) {
        console.error(`Error fetching user: ${err.message}`);
        return {
            message: "Server error",
            success: false,
            // error: err.message
        };
    }
}

const getUser = async (regNumber) => {
    const user = await User.findOne({regNo:regNumber});
    if (!user)
        throw new AppError("No such user", 404);
    return user;
}

export {
    registerUser,
    findUser,
    getUser,
    recordAttendance
}