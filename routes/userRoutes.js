const express = require('express');
const asyncHandler = require('express-async-handler')
const user = require('../models/user')
const cart = require('../models/cart')
const userRoute = express.Router();
const generateToken = require("../utils/generateToken");
const crypto = require('crypto')
const axios = require('axios')
const Url = 'http://localhost:4000/api/notify/'
const bcrypt = require('bcryptjs');

//Register Route
userRoute.post('/register',asyncHandler(async(req,res) => {
    const {First_Name,Last_Name,Email,Password,Phone_Number,Address:{City,District,StreetName,BuildingNo,Floor,ApartmentNo},AddressLink:{Latitude,Longitiude}} = req.body; 
    if(req.body){
    const userExist = await user.findOne({Email:Email});
 
    if(userExist){
        throw new Error('This Email Already has an account');
    }
      
    const createUser = await user.create({First_Name,Last_Name,Email,Password,Phone_Number,Address:{City,District,StreetName,BuildingNo,Floor,ApartmentNo},AddressLink:{Latitude,Longitiude},isGuest:false,EmailToken:crypto.randomBytes(64).toString('hex'),isVerified:false})
    const createCart = await cart.create({UserId:createUser._id,Items:[]})
    const url = Url+'register/?userEmail='+createUser.Email+'&userEmailToken='+createUser.EmailToken
    const items = await axios.get(url)
    res.json({
        _id: createUser._id,
        Cart_ID:createCart._id,
        First_Name: createUser.First_Name,
        Last_Name: createUser.Last_Name,
        Password: createUser.Password,
        token : generateToken(createUser._id),
        Email: createUser.Email,
        Phone_Number: createUser.Phone_Number,
        Address: createUser.Address,
        City: createUser.City,
        District: createUser.District,
        StreetName: createUser.StreetName,
        BuildingNo : createUser.BuildingNo,
        Floor : createUser.Floor,
        ApartmentNo: createUser.ApartmentNo,
        AddressLink: createUser.AddressLink,
        Longitiude:createUser.Longitiude,
        Latitude:createUser.Latitude,



    });
}
else{
    const createUser = await user.create({isGuest:true})
    const createCart = await cart.create({UserId:createUser._id,Items:[]})
}
} ))

//Login User

userRoute.post('/login',asyncHandler(async(req,res) => {
    const {Email,Password} = req.body;

    const emailExist = await user.findOne({Email:Email});

    if(!emailExist){
        throw new Error('Email or Password is incorrect');
    }

    const userExist = await user.findOne({ Email:Email});
    
    if (userExist && await userExist.isPasswordMatch(Password)) {
      //set status code
      res.status(200);
        cartOfUser = await cart.findOne({UserId:userExist._id})
      res.json({
        _id: userExist._id,
        Cart_ID:cartOfUser,
        First_Name: userExist.First_Name,
        Password: userExist.Password,
        token : generateToken(userExist._id),
        Email: userExist.Email,
      });
    } else {
      res.json({ Password: userExist.Password,})
      res.status(401);
      throw new Error('Invalid credentials');
    }
}))

//Delete Route

userRoute.delete('/:id',asyncHandler(async(req,res) => {
    const userExist = await user.findOne({ _id:req.params.id});
    
    if(!userExist){
        throw new Error('User does not exist');
    }
    
    user.findOneAndRemove(req.params.id)
    .exec()
    res.send('user deleted')
}))

//Get profile
userRoute.get('/profile/:id',asyncHandler(async(req,res) =>{
    const userExist = await user.findOne({ _id:req.params.id});
    
    if(!userExist){
        throw new Error('User does not exist');
    }
    res.status(200).json(userExist);
}))


//Edit profile

userRoute.patch('/update/:id',asyncHandler(async(req,res)=>{
    const userExist = await user.findOne({ _id:req.params.id});
    let {First_Name,Last_Name,Password,Phone_Number} = req.body; 
    if(!userExist){
        throw new Error('User does not exist');
    }
    else{
        if(!First_Name == ''){
            user.updateOne({_id: req.params.id},{First_Name:First_Name})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:'Could not update the document'})
            })
        }
        if(!Last_Name == ''){
            user.updateOne({_id: req.params.id},{Last_Name:Last_Name})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:'Could not update the document'})
            })
        }
        if(!Password == ''){
            const salt = await bcrypt.genSalt(10);
            Password = await bcrypt.hash(Password, salt);
            user.updateOne({_id: req.params.id},{Password:Password})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:'Could not update the document'})
            })
        }
        if(!Phone_Number == ''){
            user.updateOne({_id: req.params.id},{Phone_Number:Phone_Number})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:'Could not update the document'})
            })
        }
        
       
    }

}))

userRoute.get('/verify',asyncHandler(async(req,res) =>{
     const User = await user.findOne({EmailToken:req.query.emailtoken})
     if(!User){
         res.send("Token in valid")
     }
     await user.updateOne({_id: User._id},{$set: {EmailToken:null,isVerified:true}})
    
     res.send(`Welcome To The Family ${User.First_Name} `)
}))

module.exports = userRoute;