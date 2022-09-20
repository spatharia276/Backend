import { Schema, model } from 'mongoose';

const userSchema = new Schema({
username:{
    type:String,
    required:[true, 'Usesname is required to create account'],
    unique:[true, 'Account with this usename already exist']
},
email:{
    type:String,
    reuired:[true, 'Email is required to create account'],
    unique:[true, 'Account with this email already exist']
},
password:{
    type:String,
    required:[true, 'Password is required to create account'],
    minlength: 6
},
videos:[
    {
        type:Schema.Types.ObjectId,
        ref:'videos'
    }
],
Subscribers:{
    type:Array,
    default:[]
},
userScribedChannels:{
    type:Array,
    default:[]
},
})
export const userModel = model('user', userSchema)