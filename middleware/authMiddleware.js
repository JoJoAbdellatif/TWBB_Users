const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const user = require('../models/user')
const authMiddleware = asyncHandler(async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,nodejs)

            const user = await User.findById(decoded.id);
            req.user = user;

            next();
            
        } catch (error) { 
            res.status(401)
            throw new Error('Not authorised,invalid token');
        }
    }
});

module.exports = authMiddleware;