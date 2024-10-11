import {User, History} from '../api/models/user.model.js';
import dataFormatter from '../utils/dataFormatter.js';

const registerUser = async (inputs) => {
    const {regNo, firstName, otherName, department, level, gender} = inputs;
    try {

        const foundUser =  await findUser(regNo);

        // If error occured in finding user we return error
        if (foundUser?.success === false)
            return foundUser;

        // Recording attendance if user exists
        if (foundUser) {
            const recorded = await recordAttendance(regNo);
            return dataFormatter(recorded);
        }

        // Creating new user if not found
        const newUser = new User(inputs);
        const registered = await newUser.save();
        const regData = dataFormatter(registered);

        // Recording new user attendance
        const recorded = await recordAttendance(regData.regNo);
        return dataFormatter(recorded);

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
        regNo:regNmbr
    });

    try {
        const recorded = await record.save();
        return recorded;
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
        const foundUser = await User.findOne({
            regNo:regNmbr
        });

        if ( !foundUser )  
            return null;
        return foundUser.toObject();
    } catch (err) {
        console.error("Server error!!??:",err.stack);
        return {
            message:"Server error",
            success:false
        }   
    }
}


export {
    registerUser
}