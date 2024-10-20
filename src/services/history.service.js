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

export {
    isValidTicket
};