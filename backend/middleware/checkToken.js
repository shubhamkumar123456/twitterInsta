var jwt = require('jsonwebtoken');
let JWT_SECRET = "Shaktiman"

let checkToken = (req,res,next)=>{
    let token  = req.headers.authorization;// token aw daN KAH KFJAH K GA FGSEJH
    // console.log(token)
    try {
        var decoded = jwt.verify(token, JWT_SECRET);  //{_id:4567890}
        console.log(decoded)  //{_id:'awdawdawd}
        req.user = decoded._id  // {_id:userID} // 4567890
        next()
        // next()
      } catch(err) {
        // err
        console.log(err)
        return res.json({msg:"provide valid token!",success:false})
      }

}




module.exports = checkToken