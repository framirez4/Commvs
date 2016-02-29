var fs = require('fs');

//secret and database
module.exports = {

    'secret': {
      'simple_key': 'secretKey',
      'private': fs.readFileSync('./keys/private_key.pem'),
      'public':  fs.readFileSync('./keys/public_key.pem')
    },
    'database': 'mongodb://localhost:27017/commvs',
    'port': process.env.PORT || 3000,
    'options': {
      'key': fs.readFileSync('./keys/key.pem'),
      'cert': fs.readFileSync('./keys/cert.pem')
    }

};
