const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"user already registered"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
   address:{
    type:String
   },
   profilePic:{
    type:String,
    default:"https://clipart-library.com/new_gallery/2-28998_icon-person-transparent-background.png"
   },
   coverPic:{
    type:String
   },
},{timestamps:true})

userSchema.add({
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    resetToken:{
        type:String,
        default:null
    },
    bio:{
        type:String,
        default:""
    }
    
})

module.exports = mongoose.model(  'user',userSchema )

