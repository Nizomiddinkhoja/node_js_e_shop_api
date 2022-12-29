const express = require('express');
const router = express.Router();
const UserController = require("../controllers/users");

// get all
router.get('/', async (req, res) => await UserController.getAll(req, res));
//get by id
router.get('/:id', async (req, res) => await UserController.getById(req, res));
//create
router.post('/', async (req, res) => await UserController.create(req, res));
//register
router.post('/register', async (req, res) => await UserController.create(req, res));
//login
router.post('/login', async (req, res) => await UserController.login(req, res));
//get count
router.get('/get/count', async (req, res) => await UserController.getCount(req, res));
//delete
router.delete('/:id', (req, res) => UserController.deleteById(req, res));

module.exports = router;