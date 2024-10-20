import { History } from "../api/models/user.model.js"
import AppError from "../errors.js";
import validateDate from '../utils/dateValidator.js';

const isValidRef = async (refId) => {
    const record = await History.findById(refId);
    if (!record)
        throw new AppError("Invalid reference id", 400);
    const valid = validateDate(record._id.getTimestamp());
    return valid;
} 

export {
    isValidRef
};