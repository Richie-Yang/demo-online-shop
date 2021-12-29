const db = require('../models')
const Order = db.Order

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
}

module.exports = orderController