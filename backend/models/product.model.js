var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({

	name:{
		type:String
	},
	quantity:{
		type:Number
	},
	origin:{
		type:String
	},
	price:{
		type:Number
	},
	size:{
		type:String
	},
	color:{
		type:String
	},
	weight:{
		type:String
	},
	ManuDate:{
		type:Date
	},
	ExpiryDate:{
		type:Date
	},
	category:{
		type:String
	},
	brand:{
		type:String
	},
	ModelNo:{
		type:String
	},
	quality:{
		type:String,
		enum:['low','medium','high'],
		default:'high'
	},
	status:{
		type:String,
		enum:['available','sold','out of order','out of stock'],
		default:'available'
	},
	description:{
		type:String
	},
	batchNo:{
		type:Number
	},
	targetedGroup:{
		type:String
	},
	image:{
		type:String
	},
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	tags:{
		type:[String]
	}

},{
	timestamps: true
});

var ProductModel = mongoose.model('product',ProductSchema);

module.exports = ProductModel;