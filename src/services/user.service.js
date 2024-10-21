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

    const hasTicket = await userHasTicket(regNmbr);
    if (hasTicket)
        throw new AppError("User has ticket", 400);
    const recorded = await record.save()
    const recordedAt = recorded._id.getTimestamp();
    const {_id, ...rest} = dataFormatter(recorded);
    return  {...rest, recordedAt};
}
const getUser = async (regNumber) => {
    const user = await User.findOne({regNo:regNumber});
    if (!user)
        throw new AppError("No such user", 404);
    return user;
}
const buyTicket = async (regNumber) => {
    const user = await getUser(regNumber);
    const recorded = await recordAttendance(regNumber);
    return {...dataFormatter(user), ...recorded}
}

export {
    registerUser,
    getUser,
    buyTicket,
    recordAttendance
}