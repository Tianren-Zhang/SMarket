const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',
    authMiddleware,
    orderController.placeOrder
);

router.get('/me',
    authMiddleware,
    orderController.getOrderHistory
);

router.get('/me/:orderId',
    authMiddleware,
    orderController.getOrderDetails
);

router.put('/:orderId/status',
    authMiddleware,
    orderController.updateOrderDetails
);

router.delete('/',
    authMiddleware,
    orderController.cancelOrder
);

router.get('/customer',
    orderController.getAllCustomerOrders
);

router.get('/merchant',
    orderController.getAllIndividualOrders
);


module.exports = router;
