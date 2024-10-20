import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    regNo:{
        type:Number,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true,
    },
    otherName:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    level:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        enum: ['male', 'female'],
        default:"male"
    }
});

const schoolSchema = new mongoose.Schema({
    name :{ 
        type: String,
        required:true
    },
    department :{
        type: Array,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
const School = mongoose.model('School', schoolSchema)

export {
    User,
    School
}