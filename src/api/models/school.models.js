import mongoose from "mongoose"

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
const School = mongoose.model('School', schoolSchema)

export {
    School
}