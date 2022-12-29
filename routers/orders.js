const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orders');

//get all
router.get('/', async (req, res) => await OrderController.getAll(req, res));
// get by id
router.get('/:id', async (req, res) => await OrderController.getById(req, res));
//create
router.post('/', async (req, res) => await OrderController.create(req, res));
//update
router.put('/:id', async (req, res) => await OrderController.update(req, res));
//delete
router.delete('/:id', (req, res) => OrderController.delete(req, res));
//get totalsales
router.get('/get/totalsales', async (req, res) => OrderController.totalsales(req, res));
//get count
router.get('/get/count', async (req, res) => OrderController.count(req, res));
//get user orders
router.get('/get/userorders/:userid', async (req, res) => OrderController.userorders(req, res));

module.exports = router;