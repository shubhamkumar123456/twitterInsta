const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title:String,
    description:{
        type:String
    },
    files:[],
    // image:{
    //     type:String
    // },
    // video:{
    //     type:String
    // },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})


postSchema.add({
    comments:[
        {   
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
                required:true
            },
            text:{
                type:String,
                required:true
            }
            ,createdAt:{
                type:Date,
                default:Date.now
            }
        },
       
    ],
    likes:[
        {   
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        },
       
    ]
})


module.exports = mongoose.model('posts',postSchema)