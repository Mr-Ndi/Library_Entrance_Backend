import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    regNo:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true,
        unique:true
    },
    lastName:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true,
        unique:true
    }
});

const historySchema = new mongoose.Schema({
    regNo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true        
    }
});

const User = mongoose.model('User', userSchema);
const History = mongoose.model('History', historySchema );

export default {
    User,
    History
}