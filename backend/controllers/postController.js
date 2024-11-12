

let Post = require('../models/PostSchema');


const createPost = async(req,res)=>{

        const {title,description,files} = req.body;
        const userId = req.user // getting this from token 
       let arr= files.map((file)=>{
            let obj = {};
            obj.resource_type=file.data.resource_type,
            obj.url = file.data.secure_url
            return obj
        })
        console.log(arr)
        // console.log(req.body)
       try {
        let data = await Post.create({
            title:title,
            description,
            files:arr,
            userId
        })
       return res.json({msg:"post created successfully",success:true,data})
       } catch (error) {
        return res.json({msg:"error in creating post",success:false,error:error.message})
       }


}
const updatePost = async(req,res)=>{
    // res.send("updatePost post working")
   try {
    let userId = req.user; 
    let postId = req.params._id;

    let post = await Post.findById(postId)
    console.log("postUser = ",post.userId.toString())
    console.log("token User = ",userId.toString())
    if(post.userId.toString() !== userId.toString()){
        return res.json({msg:"not authorized to update this post",success:false})
    }
    console.log("userid = ", userId)

    let {title,description} = req.body;
    let data = await Post.findByIdAndUpdate(postId,{$set:{title,description}},{new:true})
    return res.json({msg:"post updated successfully",success:true,data})
   } catch (error) {
    return res.json({msg:"error in updating post",success:false,error:error.message})
   }
}
const deletePost = async(req,res)=>{
    try {
        let userId = req.user; 
        let postId = req.params._id;
    
        let post = await Post.findById(postId)
        console.log(post)
        if(!post){
            return res.json({msg:"post not found",success:false})
        }
     
        if(post.userId.toString() !== userId.toString()){
            return res.json({msg:"not authorized to update this post",success:false})
        }
      
    
        let data = await Post.findByIdAndDelete(postId)
        return res.json({msg:"post deleted successfully",success:true})
       } catch (error) {
        return res.json({msg:"error in deleting post",success:false,error:error.message})
       }
}
const getAllUserPost = async(req,res)=>{
    // res.send("all user post working")
   try {
    let posts = await Post.find().populate({path:'userId',select:['name','profilePic']}).populate({ 
        path: 'comments',
        populate: {
          path: 'userId',
        } 
     })
   
        return res.json({msg:"post fetched successfully", success:true,posts})
   
   } catch (error) {
    return res.json({msg:"error in getting all post",success:false,error:error.message})
   }

}
const getYourPost = async(req,res)=>{
    // res.send("your  post working")
    let userId = req.user;
    
   try {
    let post = await Post.find({userId}).populate({path:"userId",select:'-password'}).populate({ 
        path: 'comments',
        populate: {
          path: 'userId',
          select:['name','profilePic']
        } 
     }).populate('likes','name profilePic')
    res.json({msg:"post fetched successfully", success:true,post})
   } catch (error) {
    return res.json({msg:"error in getting user post",success:false,error:error.message})
   }
}


const commentPost = async(req,res)=>{
    let userId = req.user
    const { text} = req.body;
    const {postId} = req.params
    try {
        let post = await Post.findById(postId);
        post.comments.push({userId,text,})
        await post.save();
        res.json({msg:"comment successfully", post,success:true});
    } catch (error) {
        return res.json({msg:"error in commenting post",success:false,error:error.message})
    }


}

const likePost = async(req,res)=>{
        const { postId} = req.params;
        const userId = req.user;
        console.log(userId)
        console.log(postId)

   try {
    const post = await Post.findById(postId);
    if(post.likes.includes(userId)){
        post.likes.pull(userId)
        await post.save()
        return res.json({msg:"post dislike successfully", success:true,post})
    }
    else{
        post.likes.push(userId)
        await post.save()
        return res.json({msg:"post liked successfully", success:true,post})
    }
   } catch (error) {
    return res.json({msg:"error in like post",success:false,error:error.message})
   }
}



module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllUserPost,
    getYourPost,
    commentPost,
    likePost
}