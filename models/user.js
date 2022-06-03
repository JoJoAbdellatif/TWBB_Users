const mongoose  =require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.pluralize(null);

const userSchema = new mongoose.Schema({
    First_Name:{
        type:String,
        
    },
    Last_Name:{
        type:String,
       
    },
    Email:{  
        type:String, 
        unique:true
    },
    EmailToken:{
        type:String
    },
    isVerified:{
        type:Boolean 
    },
    Password:{
        type:String,
      
    },
    Phone_Number:{
        type:String,
       
    },
    Address:[{
        City:{
        type:String,
       
        },
        District:{
            type:String,
         
        },
        StreetName:{
            type:String,
          
        },
        BuildingNo:{
            type:String,
         
        },
        Floor:{
            type:Number,
          
        },
        ApartmentNo:{
            type:Number,
           
        }
    }],
    AddressLink:{
        Latitude:{
            type:String,
          
        },
        Longitiude:{
            type:String,
          
        },
    },
    Cards:[{
        CardOwnerName:{
            type : String
        },
        CardNumber:{
            type : String,
           
        },
        ExpiryMonth:{
            type: String,
           
        },
        ExpiryYear:{
            type: String,
         
        },
        CVV:{
            type : String,
          
        }
    }],
    Favourites:[
        {
            Item:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            }
        }
    ],
    isGuest:{
        type: Boolean,
        required:true
    }


})

userSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        next();
      }
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  });

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.Password);
  };

const user = mongoose.model('Registered',userSchema);

module.exports = user;