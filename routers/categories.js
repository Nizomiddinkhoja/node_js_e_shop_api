const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categories');

//get all
router.get('/', async (req, res) => await CategoryController.getAll(req, res));
//get by id
router.get('/:id', async (req, res) => await CategoryController.getById(req, res));
//create
router.post('/', async (req, res) => await CategoryController.create(req, res));
//update
router.put('/:id', async (req, res) => await CategoryController.update(req, res));
//delete
router.delete('/:id', (req, res) => CategoryController.delete(req, res));

module.exports = router;