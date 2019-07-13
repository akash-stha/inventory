var express = require('express');
var router = express.Router();
var ProductModel = require('./../models/product.model');
var multer = require('multer');
var fs = require('fs');

// var upload = multer({
// 	dest: './images'
// });

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './images')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
})

// function fileFilter(req,file,cb){
// 	if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
// 		cb(null,true);
// 	}else{
// 		req.invalidFile = true;
// 		cb(null,false);
// 	}
// }

var upload = multer({
	storage: storage,
	// fileFilter:fileFilter
});

function map_product_req(product, productDetails) {
	if (productDetails.name)
		product.name = productDetails.name;
	if (productDetails.quantity)
		product.quantity = productDetails.quantity;
	if (productDetails.origin)
		product.origin = productDetails.origin;
	if (productDetails.price)
		product.price = productDetails.price;
	if (productDetails.size)
		product.size = productDetails.size;
	if (productDetails.color)
		product.color = productDetails.color;
	if (productDetails.weight)
		product.weight = productDetails.weight;
	if (productDetails.ManuDate)
		product.ManuDate = new Date(productDetails.ManuDate);
	if (productDetails.ExpiryDate)
		product.ExpiryDate = new Date(productDetails.ExpiryDate);
	if (productDetails.category)
		product.category = productDetails.category;
	if (productDetails.brand)
		product.brand = productDetails.brand;
	if (productDetails.ModelNo)
		product.ModelNo = productDetails.ModelNo;
	if (productDetails.quality)
		product.quality = productDetails.quality;
	if (productDetails.status)
		product.status = productDetails.status;
	if (productDetails.description)
		product.description = productDetails.description;
	if (productDetails.targetedGroup)
		product.targetedGroup = productDetails.targetedGroup;
	if (productDetails.image)
		product.image = productDetails.image;
	if (productDetails.tags)
		product.tags = productDetails.tags.split(',');

	return product;
}



module.exports = function () {

	router.route('/')

		.get(function (req, res, next) {
			var condition = {};
			if (req.loggedInUser.role !== 1) {
				condition.user = req.loggedInUser._id
			}
			console.log(condition)
			ProductModel.find(condition)
			.sort({
				_id: -1
			})
			.exec(function (err, products) {
				if (err) {
					return next(err);
				}
				res.status(200).json(products);
			})
		})

		.post(upload.single('image'), function (req, res, next) {
			console.log('req.body data: ', req.body);
			console.log('req.body file: ', req.file);

			// if(req.invalidFile){
			// 	next({
			// 		message:'invalid file format',
			// 		status:400
			// 	});
			// }

			if (req.file) {

				var fileFormat = req.file.mimetype.split('/')[0];
				console.log('filename',req.file.filename);

				if (fileFormat !== 'image') {

					fs.unlink('./images/'+req.file.filename,function(err,done){
						if(err){
							console.log('err ',err);
						}
					});
					next({
						message: 'invalid file format',
						status: 400
					})
				return;

				}

				// if(req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/jpg'){

				// }else{

				// 	fs.unlink('./images' + req.file.filename);

				// 	next({
				// 		message:'invalid file format',
				// 		status:400
				// 	})
				// }

				// return;
			}

			var newProduct = new ProductModel({});

			// newProduct.name = req.body.name;
			// newProduct.quantity = req.body.quantity;
			// newProduct.origin = req.body.origin;
			// newProduct.price = req.body.price;
			// newProduct.size = req.body.size;
			// newProduct.color = req.body.color;
			// newProduct.weight = req.body.weight;
			// newProduct.ManuDate = new Date(req.body.ManuDate);
			// newProduct.ExpiryDate = new Date(req.body.ExpiryDate);
			// newProduct.category = req.body.category;
			// newProduct.brand = req.body.brand;
			// newProduct.ModelNo = req.body.ModelNo;
			// newProduct.quality = req.body.quality;
			// newProduct.status = req.body.status;
			// newProduct.description = req.body.description;
			// newProduct.targetedGroup = req.body.targetedGroup;
			// newProduct.image = req.body.image;
			// newProduct.tags = req.body.tags.split(',');
			// newProduct.user = req.body.user;

			var mappedProduct = map_product_req(newProduct, req.body);

			mappedProduct.user = req.loggedInUser._id;

			if (req.file) {
				mappedProduct.image = req.file.filename;
			}

			mappedProduct.save(function(err, success) {
				if (err) {
					return next(err);
				}
				res.status(200);
				res.json(success);
			})

		})
	router.route('/search')

		.get(function (req, res, next) {
			var condition = {}
			var searchQuery = map_product_req(condition, req.query);
			ProductModel.find(searchQuery).exec(function (err, products) {
				if (err) {
					return next(err);
				}
				res.status(200).json(products);
			})
		})

		.post(function (req, res, next) {
			var condition = {}
			var searchCondition = map_product_req(condition, req.body);

			if(req.body.minPrice){
				searchCondition.price = {
					$gte:req.body.minPrice
				}
			}

			if(req.body.maxPrice){
				searchCondition.price = {
					$lte:req.body.maxPrice
				}
			}

			if(req.body.minPrice && req.body.maxPrice){
				searchCondition.price = {
					$gte : req.body.minPrice,
					$lte : req.body.maxPrice
				}
			}

			if(req.body.fromDate && req.body.toDate){

				var fromDate = new Date(req.body.fromDate).setHours(0,0,0,0);
				var toDate = new Date(req.body.toDate).setHours(11,59,0,0);

				searchCondition.createdAt = {
					$gte: new Date(fromDate),
					$lte: new Date(toDate)
				}
			}

			if(req.body.tags){
				var tagsArr = req.body.tags.split(',');
				searchCondition.tags = {
					$in: tagsArr
				}
			}

			console.log('search query is ',searchCondition);

			ProductModel.find(searchCondition).exec(function (err, products) {
				if (err) {
					return next(err);
				}
				res.status(200).json(products);
			})
		})

	router.route('/:id')

		.get(function (req, res, next) {
			var id = req.params.id;

			ProductModel.findById({
				_id: id
			}).exec(function (err, product) {
				if (err) {
					return next(err);
				}
				if (product) {
					res.status(200).json(product);
				} else {
					next({
						message: 'product not found',
						status: 404
					})
				}
			})
		})

		.put(upload.single('image'), function (req, res, next) {
			var id = req.params.id;

			ProductModel.findById({
				_id: id
			}).exec(function (err, product) {
				if (err) {
					return next(err);
				}
				if (product) {
					// if(req.body.name)
					// 	product.name = req.body.name;
					// if(req.body.quantity)
					// 	product.quantity = req.body.quantity;
					// if(req.body.origin)
					// 	product.origin = req.body.origin;
					// if(req.body.price)
					// 	product.price = req.body.price;
					// if(req.body.size)
					// 	product.size = req.body.size;
					// if(req.body.color)
					// 	product.color = req.body.color;
					// if(req.body.weight)
					// 	product.weight = req.body.weight;
					// if(req.body.ManuDate)
					// 	product.ManuDate = new Date(req.body.ManuDate);
					// if(req.body.ExpiryDate)
					// 	product.ExpiryDate = new Date(req.body.ExpiryDate);
					// if(req.body.category)
					// 	product.category = req.body.category;
					// if(req.body.brand)
					// 	product.brand = req.body.brand;
					// if(req.body.ModelNo)
					// 	product.ModelNo = req.body.ModelNo;
					// if(req.body.quality)
					// 	product.quality = req.body.quality;
					// if(req.body.status)
					// 	product.status = req.body.status;
					// if(req.body.description)
					// 	product.description = req.body.description;
					// if(req.body.targetedGroup)
					// 	product.targetedGroup = req.body.targetedGroup;
					// if(req.body.image)
					// 	product.image = req.body.image;
					// if(req.body.tags)
					// 	product.tags = req.body.tags.split(',');
					// newProduct.user = req.body.user;

					var oldImage = product.image;

					var updatedMappedProduct = map_product_req(product, req.body);
					if(req.file){
						updatedMappedProduct.image = req.file.filename
					}

					updatedMappedProduct.save(function (err, updated) {
						if (err) {
							return next(err);
						}if(req.file){
						fs.unlink('./images/' + oldImage,function(err,done){
							if(err){
								console.log('error is:',err);
							}
						});							//callback must be a function
						}
						res.status(200);
						res.json(updated);
					})
				} else {
					next({
						message: 'product not found',
						status: 404
					})
				}
			})


		})

		.delete(function (req, res, next) {
			var id = req.params.id;

			ProductModel.findById({
				_id: id
			}).exec(function (err, product) {
				if (err) {
					return next(err);
				}
				if (product) {
					product.remove(function (err, deleted) {
						if (err) {
							return next(err);
						}
						res.status(200).json(deleted);
					})
				} else {
					next({
						message: 'product not found',
						status: 404
					})
				}
			})
		})


	return router;

}
