import mongoose from "mongoose";
import { History } from "../api/models/history.model.js"
import AppError from "../errors.js";
import dataFormatter from "../utils/dataFormatter.js";
import validateDate from '../utils/dateValidator.js';
import { getUser } from "./user.service.js";

const isValidTicket = async (ticketId) => {
    const record = await History.findOne({
        ticketId
    });
    if (!record)
        throw new AppError("Invalid ticket id", 404);
    const valid = validateDate(record._id.getTimestamp());
    if (valid){
        const user = await getUser(record.regNo);
        return {
            valid,
            user:dataFormatter(user)
        }
    }
    return {valid};
} 

const userHasTicket = async (regNmbr) => {
    const from = new Date();
    const to = new Date();
    from. setHours(0, 0, 0);
    to.setHours(23, 59,59,999);

    const fromOb = new mongoose.Types.ObjectId( 
        Math.floor(from.getTime()/1000).toString(16) + "0000000000000000"
    );

    const toOb = new mongoose.Types.ObjectId( 
        Math.floor(to.getTime()/1000).toString(16) + "0000000000000000"
    );

    const ticket = await History.findOne({
        regNo:regNmbr,
        _id:{
            $gte:fromOb,
            $lt:toOb
        }
    });

    return ticket;
}

export {
    isValidTicket,
    userHasTicket
};