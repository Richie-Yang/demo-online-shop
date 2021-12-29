const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart


let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ 
      include: 'products',
      raw: true,
      nest: true 
    })
      .then(orders => {
        return res.render('orders', { orders })
      })
  },

  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'products' }).then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      }).then(order => {

        var results = [];
        for (var i = 0; i < cart.products.length; i++) {
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.products[i].id,
              price: cart.products[i].price,
              quantity: cart.products[i].CartItem.quantity,
            })
          );
        }

        return Promise.all(results).then(() =>
          res.redirect('/orders')
        );

      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  },
}

module.exports = orderController