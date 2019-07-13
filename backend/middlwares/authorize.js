module.exports = function (req, res, next) {

	console.log('logged in user in authorize', req.loggedInUser);
	if(req.loggedInUser.role == 1){
		return next();
	}else{
		return next({
			message:'you do not have access',
			status:404
		});
	}

}

// 	var jwt = require('jsonwebtoken');
// 	var config = require('./../config');

// 	var token;

// 	if(req.headers['x-access-token']){
// 		token=req.headers['x-access-token']
// 	}
// 	if(req.headers['authorization']){
// 		token=req.headers['authorization']
// 	}
// 	if(req.headers.token){
// 		token=req.headers.token;
// 	}
// 	if(req.query.token){
// 		token=req.query.token;
// 	}

// 	if (token) {
// 		jwt.verify(token,config.jwtSecret,function(err,decoded){
// 			if(err){
// 				return next(err);
// 			}
// 			console.log('Decoded value is: ',decoded);
// 			if(decoded.role == 1){
// 				return next();
// 			}else{
// 				return next({
// 					message:'you do not have aceess',
// 					status:403
// 				})
// 			}
// 			return next();
// 		});
// 	} else {
// 		next({
// 			message: "Token not provided",
// 			status: 403
// 		})
// 	};
// }; 


