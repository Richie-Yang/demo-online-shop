const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3
const PAGE_OFFSET = 0


const productController = {
  getProducts: (req, res) => {
    return Product.findAndCountAll({ 
      offset: PAGE_OFFSET, 
      limit: PAGE_LIMIT,
      raw: true,
      nest: true
    }).then(products => {
      return Cart.findByPk(req.session.cartId, { include: ['products'] })
      .then(cart => {
        cart = cart || { products: [] }
        let totalPrice = cart.products.length > 0 ? 
          cart.products.map(d => d.price * d.CartItem.quantity)
          .reduce((a, b) => a + b) : 0

        return res.render('products', {
          products,
          cart: cart.toJSON(),
          totalPrice,
        })
      })
    })
  }
}


module.exports = productController