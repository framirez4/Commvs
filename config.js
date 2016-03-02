var fs = require('fs');

//secret and database
module.exports = {

    'secret': {
      'simple_key': 'secretKey',
      'private': fs.readFileSync('./keys/id_rsa'),
      'public':  fs.readFileSync('./keys/id_rsa.pub')
    },
    'database': 'mongodb://localhost:27017/commvs',
    'port': process.env.PORT || 8000,
    'options': {
      'key': fs.readFileSync('./keys/key.pem'),
      'cert': fs.readFileSync('./keys/cert.pem')
    }

};
