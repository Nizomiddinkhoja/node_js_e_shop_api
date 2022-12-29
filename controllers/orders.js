const Order = require('../models/order');
const OrderItem = require("../models/order-item");

exports.getAll = async (req, res) => {
    const dataList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    if (!dataList) {
        res.status(500).json({success: false});
    }
    res.send(dataList);
}

exports.getById = async (req, res) => {
    const data = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });
    if (!data) {
        res.status(500).json({success: false});
    }
    res.send(data);
}

exports.create = async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity, product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemsId => {
        const orderItem = await OrderItem.findById(orderItemsId).populate('product', 'price');
        return orderItem.product.price * orderItem.quantity
    }));

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

    let data = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    data = await data.save();

    if (!data) {
        return res.status(404).send('The order cannot be created');
    }
    res.send(data);
}

exports.update = async (req, res) => {
    const data = await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true});

    if (!data) {
        return res.status(404).send('The order cannot be updated');
    }
    res.send(data);
}

exports.delete = (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            });
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'the order not found!'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    });
}

exports.totalsales = async (req, res) => {
    const totalSales = await Order.aggregate([{$group: {_id: null, totalsales: {$sum: '$totalPrice'}}}]);
    if (!totalSales) {
        res.status(500).send('The order sales cannot be generated');
    }
    res.status(200).send({totalSales: totalSales.pop().totalsales});
}

exports.count = async (req, res) => {
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
        res.status(500).json({success: false});
    }
    res.status(200).send({orderCount});
}

exports.userorders = async (req, res) => {
    const dataList = await Order.find({user: req.params.userid})
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        })
        .sort({'dateOrdered': -1});
    if (!dataList) {
        res.status(500).json({success: false});
    }
    res.send(dataList);
}