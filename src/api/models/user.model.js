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

const User = mongoose.model('User', userSchema);

export default User