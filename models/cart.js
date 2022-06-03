const mongoose  =require('mongoose');
mongoose.pluralize(null);

const cartSchema = new mongoose.Schema({
            UserId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                
            },
            Items:[{
                ProductId:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product'
                },
                Quantity:{
                    type: Number,
                    range:[1,50]
                }
            }
        ]
        
 
})

const cart = mongoose.model('Cart',cartSchema);

module.exports = cart;