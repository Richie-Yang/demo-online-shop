const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0


const cartController = {
  getCart: (req, res) => {
    return Cart.findOne({ include: ['products'] })
      .then(cart => {
        const totalPrice = cart.products.length > 0 ?
          cart.products.map(d => {
            return d.price * d.CartItem.quantity
          }).reduce((pn, nn) => pn + nn) : 0

        return res.render('cart', { 
          cart: cart.toJSON(), 
          totalPrice 
        })
      })
  }
}


module.exports = cartController