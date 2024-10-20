import { History } from "../api/models/user.model.js"

const checkRec = async (refId) => await History.findById(refId);

export {
    checkRec
};