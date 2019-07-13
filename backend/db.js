var mongoose = require('mongoose');
var config = require('./config');
var localConxnUrl = config.dbUrl+'/'+config.dbName;
var mlabConxnUrl = config.mlabUrl;
var url;
if( process.env.db == 'remote'){
    url=mlabConxnUrl;
}else{
    url=localConxnUrl;
}

mongoose.connect(url,function(err,done){
    if(err){
        console.log('error in connecting to db');
    }else{
        console.log('db connection open');
    }
});
// mongoose.createConnection();
