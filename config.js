var fs          = require('fs');

//secret and database
module.exports = {

    'secret': 'ilovescotchyscotch',
    'database': 'mongodb://localhost:27017/commvs',
    'port': process.env.PORT || 3000,
    'options': {
      'key': fs.readFileSync('key.pem'),
      'cert': fs.readFileSync('cert.pem')
    }

};
