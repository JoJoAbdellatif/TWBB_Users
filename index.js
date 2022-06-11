const express= require('express');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const userRoutes = require('./routes/userRoutes');
const error = require("./middleware/errorMiddlewareHandler");
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors')


const app = express();
dotenv.config();
require('./config/dbconnect')();

app.use(cors({origin: true, credentials: true}));
app.use(express.json());


app.use('/api/users',userRoutes)
app.use('/api/carts',cartRoutes)

app.use(error.errorMiddlewareHandler);


const PORT = process.env.PORT||8000;

app.listen(PORT,(req , res)=>{
    console.log(`Server is Up and Running ${PORT}`);
});