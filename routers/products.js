const express = require('express');
const router = express.Router();
const uploadOption = require('../helpers/multer');
const ProductController = require("../controllers/products");

//get all
router.get('/', async (req, res) => await ProductController.getAll(req, res));
// get by id
router.get('/:id', async (req, res) => await ProductController.getBuId(req, res));
//create
router.post('/', uploadOption.single('image'), async (req, res) => await ProductController.create(req, res));
//update
router.put(
    '/:id',
    uploadOption.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
    async (req, res) => await ProductController.updateById(req, res));
//delete
router.delete('/:id', (req, res) => ProductController.deleteById(req, res));
//get count
router.get('/get/count', async (req, res) => await ProductController.getCount(req, res));
//get featured
router.get('/get/featured/:count', async (req, res) => await ProductController.getFeatured(req, res));
//update gallery images
router.put(
    '/gallery-images/:id',
    uploadOption.array('images', 10),
    async (req, res) => await ProductController.updateGalleryImages(req, res));

module.exports = router;