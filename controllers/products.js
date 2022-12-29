const Product = require("../models/product");
const Category = require("../models/category");
const getBasePath = require("../helpers/helper");
const mongoose = require("mongoose");
require('dotenv/config');
const uploadsPath = process.env.UPLOADS_PATH;

exports.getAll = async (req, res) => {
    let filter = {};
    if (req.query?.categories) {
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        res.status(500).json({success: false});
    }
    res.send(productList);
}

exports.getBuId = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({success: false});
    }
    res.send(product);
}

exports.create = async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const basePath = getBasePath(req);

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: basePath + uploadsPath + file.filename,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
        res.status(500).send('The product cannot be created');
    }
    res.status(201).json(product);
}

exports.updateById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }
    if (!mongoose.isValidObjectId(req.body.category)) {
        return res.status(400).send('Invalid category id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category');

    const files = req.files;
    const basePath = getBasePath(req);
    let singleImagePath = null;
    let imagesPath = [];
    if (files && files['images']?.length) {
        singleImagePath = files['image'].filename;
        files['images'].map(file => {
            imagesPath.push(basePath + uploadsPath + file.filename);
        });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: singleImagePath,
        images: imagesPath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }, {new: true});

    if (!product) {
        return res.status(404).send('The product cannot be updated');
    }
    res.send(product);
}

exports.deleteById = (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'the product not found!'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    });
}

exports.getCount = async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        res.status(500).json({success: false});
    }
    res.status(200).send({productCount});
}

exports.getFeatured = async (req, res) => {
    const count = req.params.count || 0;
    const products = await Product.find({isFeatured: true}).limit(count);
    if (!products) {
        res.status(500).json({success: false});
    }
    res.status(200).send(products);
}

exports.updateGalleryImages = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }
    const files = req.files;
    const basePath = getBasePath(req);
    let imagesPath = [];
    if (files) {
        files.map(file => {
            imagesPath.push(basePath + uploadsPath + file.filename);
        });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {images: imagesPath}, {new: true});

    if (!product) {
        return res.status(404).send('The product cannot be updated');
    }
    res.send(product);
}