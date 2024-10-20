import { History } from "../api/models/user.model.js"
import AppError from "../errors.js";
import dataFormatter from "../utils/dataFormatter.js";
import validateDate from '../utils/dateValidator.js';
import { getUser } from "./user.service.js";

const isValidRef = async (refId) => {
    const record = await History.findById(refId);
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
    isValidRef
};