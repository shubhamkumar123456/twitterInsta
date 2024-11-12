let User = require('../models/UserSchema')
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
let JWT_SECRET = "Shaktiman"
var crypto = require("crypto");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
require('dotenv').config()
const path = require('path')

const registerUser = async (req, res) => {
    let { name, email, password, address } = req.body;

    //   if(!name){
    //     return res.json({msg:"name is required",success:false})
    //   }
    //   if(!email){
    //     return res.json({msg:"email is required",success:false})
    //   }
    if (!password) {
        return res.json({ msg: "password is required", success: false })
    }

    try {

        let existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ msg: "user already registered", success: false })
        }
        else {

            let hashedPassword = await bcrypt.hashSync(password, salt)
            let user = await User.create({
                name,
                email,
                password: hashedPassword,
                address
            })
            res.json({ msg: "user registered successfully", success: true, user })
        }
    } catch (error) {
        res.json({ msg: "error in creating user", error: error.message, success: false })
    }

}
const loginUser = async (req, res) => {
    let { email, password } = req.body;
    try {
        let existingUser = await User.findOne({ email })
        if (existingUser) {
            let passwordCheck = bcrypt.compareSync(password, existingUser.password)
            if (passwordCheck) {
                var token = jwt.sign({ _id: existingUser._id }, JWT_SECRET);
                return res.json({ msg: "user logged in successfully", success: true, token: token });
            } else {
                return res.json({ msg: "wrong password", success: false })
            }
        }
        else {
            return res.json({ msg: "user not found ", success: false })
        }
    } catch (error) {
        res.json({ msg: "error in log in user ", success: false, error: error.message })
    }
}
const updateUser = async (req, res) => {
    // res.send("update api working good")
    let _id = req.params._id;
    let userId = req.user;
    console.log("userId", userId)
    console.log("_id", _id)
    if (userId !== _id) {
        return res.json({ msg: "unauthorized", success: false })
    }
    let { name, password, profilePic, coverPic, address, bio } = req.body;
    let hashedpassword;
    if (password) {
        hashedpassword = bcrypt.hashSync(password, salt)
    }
    try {
        let data = await User.findByIdAndUpdate(userId, { $set: { name, password: hashedpassword, bio, profilePic, coverPic, address } }, { new: true })
        res.json({ msg: "user updated successfully", success: true, data })
    } catch (error) {
        res.json({ msg: "error in updating user", success: false, error: error.message })
    }

}
const deleteUser = async (req, res) => {
    // console.log(req)
    let _id = req.user;  //-->login {}, 66fe646e30852289a4852b5b
    let id = req.params._id // -->
    try {
        if (_id !== id) {
            return res.json({ msg: "you can delete only your account", success: false })
        }
        else {
            await User.findByIdAndDelete(_id)
            res.json({ msg: "user deleted successfully", success: true })
        }
    } catch (error) {
        res.json({ msg: "error in deleting user", success: false, error: error.message })
    }
}

const getUserDetails = async (req, res) => {
    try {
        let userId = req.user;
        let user = await User.findById(userId)
        res.json({ msg: "user fetched successfully", success: true, user })
    } catch (error) {
        res.json({ msg: "error in getting user details", success: false, error: error.message })
    }
}

const forgetPassword = async (req, res) => {
    let { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            // let resetToken = await crypto.randomBytes(64).toString('hex');
            let resetToken = await randomstring.generate(18);
            console.log(resetToken);
            //method-1
            user.resetToken = resetToken
            await user.save()
            let datasend = sendMail(email, resetToken)
            //method2
            // await User.findByIdAndUpdate(user._id,{$set:{resetToken:resetToken}})
            res.json({ msg: "please check your email for password reset", resetToken, success: true });
        }
        else {
            return res.json({ msg: "user not found", success: false })
        }
    } catch (error) {
        return res.json({ msg: "error in password reset ", success: false, error: error.message })
    }
}
async function sendMail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.NodeMailerEmail,
            pass: process.env.NodeMailerPassword,

        },
    });

    const info = await transporter.sendMail({
        from: 'shubhamfarainzi@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Reset passsword request", // Subject line
        // plain text body
        // html: `<b>hello this is your reset password link click the link below </br> http://localhost:8080/users/resetToken/${resetToken}</b>`, // html body
        text: `hello this is your reset password link click the link below \n http://localhost:8080/users/resetToken/${resetToken}`
    });

    console.log("Message sent: %s", info.messageId);
}

let rasta = path.join(__dirname, '../index.html')
console.log(rasta)

const getTokenMail = async (req, res) => {
    let token = req.params.token
    console.log(token)

    let user = await User.findOne({ resetToken: token })
    if (user) {
        res.render('newPassword', { token })

    }
    else {
        res.send('<h1> token expired </h1>')
    }


    // res.sendFile(rasta
}

const finalResetPassword = async (req, res) => {
    let token = req.params.token;
    let newPassword = req.body.password

    console.log("token=", token)
    console.log("newPassword = ", newPassword)

    let user = await User.findOne({ resetToken: token });
    if (user) {
        let hashedPassword = bcrypt.hashSync(newPassword, salt)
        user.password = hashedPassword
        user.resetToken = null;
        await user.save()
        res.json({ msg: "password updated successfully", success: true })
    }
    else {
        res.json({ msg: "token expired", success: false })
    }

    // res.json({msg:"all good"})

}


const getUserByName = async (req, res) => {
    let name = req.body;
    let users = await User.find({ name: { $regex: `/^${name}/i` } })
    res.json({ "users": users })
}


// console.log("folder = ",__dirname)
module.exports = {
    register: registerUser,
    loginUser: loginUser,
    updateUser,
    deleteUser,
    getUserDetails,
    forgetPassword,
    getTokenMail, getUserByName,
    finalResetPassword
}