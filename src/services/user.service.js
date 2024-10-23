import {User} from '../api/models/user.model.js';
import { History } from '../api/models/history.model.js';
import AppError from '../errors.js';
import dataFormatter from '../utils/dataFormatter.js';
import ticketIdGenerator from '../utils/ticketIdGenerator.js';
import { userHasTicket } from './history.service.js';

const registerUser = async (inputs) => {
    const {regNo, firstName, otherName, department, level, gender} = inputs;
    const userExists = await User.findOne({regNo});
    if (userExists)
        throw new AppError("User already exists", 400);
    const newUser = new User({
        regNo,
        firstName,
        otherName,
        department,
        level,
        gender
    });

    const user = await newUser.save();
    const ticket = await recordAttendance(user.regNo);
    const {_id, ...rest} = dataFormatter(user);

    return {...rest, ...ticket};
}

const recordAttendance = async (regNmbr) => {
    const record = new History({
        regNo:regNmbr,
        ticketId:ticketIdGenerator(regNmbr)
    });

    const hasTicket = await userHasTicket(regNmbr);
    if (hasTicket)
        throw new AppError("User already has a ticket for today", 400);
    const recorded = await record.save()
    const recordedAt = recorded._id.getTimestamp();
    const {_id, ...rest} = dataFormatter(recorded);
    return  {...rest, recordedAt};
}
const getUser = async (regNumber) => {
    const user = await User.findOne({regNo:regNumber});
    if (!user)
        throw new AppError("User not found", 404);
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