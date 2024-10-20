import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    regNo:{
        type:String,
        ref:'User',
        required:true        
    },
    ticketId:{
        type:String,
        unique:true,
    }
});

const History = mongoose.model('History', historySchema );


export {
    History
}