const express = require('express');
const asyncHandler = require('express-async-handler')
const cart = require('../models/cart')
const User = require('../models/user')

const cartRoute = express.Router();
const request = require('request');
const fetch = require('node-fetch');

//create Cart for guest
cartRoute.post('/createCart',asyncHandler(async(req,res) =>{
   const c = await cart.create({UserID:null,Items:[]})
   res.send(c._id)
})
)

//Add product

cartRoute.patch('/addProduct',asyncHandler(async(req,res) =>{
    const cartId= req.query.cartID
    const addedProduct = req.query.productID
    let t = false;

    const foundCart = await cart.findById(cartId)
    for (let i = 0; i < foundCart.Items.length;i++) {
        if(foundCart.Items[i].ProductId==addedProduct){
            foundCart.Items[i].Quantity+=1
            t = true
        }
    }
    if(!t){
        foundCart.Items.push({ProductId:addedProduct,Quantity:1})
    }
    const n = await cart.findByIdAndUpdate(cartId,foundCart)
    res.send(foundCart)
})
)

// delete one product
cartRoute.delete('/removeProduct',asyncHandler(async(req,res) => {
    const cartId= req.query.cartID
    const removingProduct = req.query.productID
    const foundCart = await cart.findById(cartId)
    for (let i = 0; i < foundCart.Items.length;i++) {
        if(foundCart.Items[i].ProductId==removingProduct){
            foundCart.Items[i].Quantity-=1
            if(foundCart.Items[i].Quantity==0){
                foundCart.Items.splice(i)
            }
        }
    }
   
    const n = await cart.findByIdAndUpdate(cartId,foundCart)
    res.send(foundCart)

 }))
//Empty Cart
cartRoute.delete('/emptyCart',asyncHandler(async(req,res) => {
    const cartId= req.query.cartID
    const cartExist = await cart.findById({ _id:cartId});
    const newCart = await cart.findByIdAndUpdate(cartId,{Items:[]})
    if(cartExist){
        res.send(cartExist.Items)
    }else{
        throw new Error('This Cart Does Not Exist');
    }
    

 }))

//Get Items
cartRoute.get('/:id',asyncHandler(async(req,res) => {
    const cartExist = await cart.findById({ _id:req.params.id});
    if(cartExist){
        res.send(cartExist.Items)
    }else{
        throw new Error('This Cart Does Not Exist');
    }
}))

module.exports = cartRoute;