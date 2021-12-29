const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0


const cartController = {
  getCart: (req, res) => {
    const cartId = req.session.cartId || 0
    console.log(cartId)

    return Cart.findOrCreate({
      where: { id: cartId }
    }).then(result => {
      const { id } = result[0].toJSON()
      Cart.findByPk(id, { include: ['products'] })
        .then(cart => {
          if (!cart.products) cart.products = []

          const totalPrice = cart.products.length > 0 ?
            cart.products.map(d => {
              return d.price * d.CartItem.quantity
            }).reduce((pn, nn) => pn + nn) : 0

          req.session.cartId = cart.id
          return res.render('cart', {
            cart: cart.toJSON(),
            totalPrice
          })
        })
    })
  },

  postCart: (req, res) => {
    const cartId = req.session.cartId || 0
    console.log(cartId)

    return Cart.findOrCreate({
      where: { id: cartId }
    }).then(result1 => {
      const cart = result1[0].toJSON()

      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
        }

      }).then(result2 => {
        const cartItem = result2[0]

        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1,
        }).then(() => {
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect('back')
            })
          })
      })
    })
  }
}


module.exports = cartController