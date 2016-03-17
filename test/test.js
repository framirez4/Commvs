var myApp = require('./servertest.js');
var assert = require('assert');
var request = require('supertest')(myApp);
var adminToken = '';
var userToken = '';
var ownership = undefined;

describe('LOAD EXPRESS APP', function(){
  it('responds to /api', function (done) {
    request
      .get('/api')
      .expect(200, done);
  });
  it('404 everything else', function (done) {
    request
      .get('/foo/bar')
      .expect(404, done);
  });
});

describe('TEST ADMIN USER test@admin.com', function() {

  it('creates a wrong user', function (done) {
    request
      .post('/api/users')
      .send({
        email: 'test',
        password: '123'
      })
      .expect(200, {
        "success": false,
        "message": [
          "Please fill a valid email address",
          "The value of password `123` is shorter than the minimum allowed length (4)."
        ]
      }, done);
  });
  it('creates a new admin user', function (done) {
    request
      .post('/api/users')
      .send({
        email: 'test@admin.com',
        password: '1234',
        role: 'admin'
      })
      .expect(200, {"success":true,"message":"New user added!"}, done);
  });
  it('creates a duplicate user', function (done) {
    request
      .post('/api/users')
      .send({
        email: 'test@admin.com',
        password: '1234',
        role: 'admin'
      })
      .expect(200, {
        "success": false,
        "message": "E11000 duplicate key error index: commvs.users.$_id_ dup key: { : \"test@admin.com\" }"
      }, done);
  });
  it('authenticates an admin user', function (done){
    request
      .post('/api/authenticate')
      .send({
        email: 'test@admin.com',
        password: '1234'
      })
      .end(function(err, res){
        adminToken = res.body.token;
        done();
      })
  });
  it('admin sets a wrong password', function (done) {
    request
      .put('/api/users')
      .send({
        token: adminToken,
        password: '123'
      })
      .expect(200, {
        "success": false,
        "message": "The value of password `123` is shorter than the minimum allowed length (4)."
      },
      done);
  });
  it('admin sets a correct password', function (done) {
    request
      .put('/api/users')
      .send({
        token: adminToken,
        password: '12345'
      })
      .expect(200, {success:true, message: 'Password successfully changed'}, done)
  });
  /*it('deletes an unexistent user', function (done) {
    request
      .delete('/api/users')
      .send({
        token: adminToken,
        email: 'test111@admin.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });*/

});

describe('DO ADMIN-ONLY ACTIONS', function(){
  it('creates a new comm', function (done) {
    request
      .post('/api/comms')
      .send({
        "token": adminToken,
        "name": "Tienda",
        "location": "Barcelona",
        "activity": "Salud",
        "gps": "(54.49593, 39.91938)",
        "web": "www.example.com",
        "email": "tienda@tienda.com",
        "address": "calle 1, 48",
        "phone": "664664664",
        "description": "Shop description",
      })
      .expect(200)
      .end(function(err,res){
        assert.equal(res.body.success, true);
        done();
      });
  });
  it('cannot create a duplicate comm', function (done) {
    request
      .post('/api/comms')
      .send({
        "token": adminToken,
        "name": "Tienda",
        "location": "Barcelona"
      })
      .expect(200)
      .end(function(err,res){
        assert.equal(res.body.success, false);
        done();
      });
  });
  it('gets a single comm', function (done) {
    request
      .get('/api/comms/barcelona_tienda')
      .expect(200)
      .end(function(err, res){
        assert.equal(res.body.hasOwnProperty('_id'), true);
        done();
      });
  });

  it('sets a comm as fav', function(done){
    request
      .post('/api/favs')
      .send({
        token: adminToken,
        comm_id: 'barcelona_tienda'
      })
      .expect(200, {
        "success": true,
        "message": "Fav added: barcelona_tienda"
      }, done);
  });
  it('UNsets a com as fav', function(done){
    request
      .delete('/api/favs')
      .send({
        token: adminToken,
        comm_id: 'barcelona_tienda'
      })
      .expect(200, {
        "success": true,
        "message": "Fav removed: barcelona_tienda"
      }, done);
  });
  it('gets a comm ownership key', function(done){
    request
      .get('/api/ownership/barcelona_tienda')
      .send({
        token: adminToken,
      })
      .end(function(err, res){
        ownership = res.body.ownership.key;
        if(ownership) done();
      })
  });
  it('gets a wrong comm ownership key', function(done){
    request
      .get('/api/ownership/barcelona_t')
      .send({
        token: adminToken,
      })
      .expect(200, {
        "success": false,
        "message": "No comm found"
      }, done);
  });
  it('sets as a comm admin', function(done){
    request
      .post('/api/ownership')
      .send({
        token: adminToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/api/ownership/barcelona_tienda')
          .send({
            token: adminToken
          })
          .expect(200)
          .end(function(err, res){
            assert.equal(res.body.ownership.owners[0] === 'test@admin.com', true);
            done();
          });
      });
  });
  it('removes as a comm admin', function(done){
    request
      .delete('/api/ownership')
      .send({
        token: adminToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/api/ownership/barcelona_tienda')
          .send({
            token: adminToken
          })
          .expect(200)
          .end(function(err, res){
            assert.equal(res.body.ownership.owners.length == 0, true);
            done();
          });
      });
  });
  it('set as admin of a comm with a wrong ownership key', function(done){
    request
      .post('/api/ownership')
      .send({
        token: adminToken,
        key: 12345
      })
      .expect(200, {
        "success": false,
        "message": "Wrong or unexistent ownership key"
      }, done);
  });
  it('removes as admin of a comm with a wrong ownership key', function(done){
    request
      .delete('/api/ownership')
      .send({
        token: adminToken,
        key: 12345
      })
      .expect(200, {
        "success": false,
        "message": "Wrong or unexistent ownership key"
      }, done);
  });


});

/*
****************************************
***     2nd BLOCK - test@user.com     ***
****************************************
*/


describe('TEST NORMAL USER test@user.com', function() {

  it('creates a new normal user', function (done) {
    request
      .post('/api/users')
      .send({
        email: 'test@user.com',
        password: '1234'
      })
      .expect(200, {"success":true,"message":"New user added!"}, done);
  });

  it('authenticates a normal user', function (done){
    request
      .post('/api/authenticate')
      .send({
        email: 'test@user.com',
        password: '1234'
      })
      .end(function(err, res){
        userToken = res.body.token;
        done();
      })
  });
  it('user sets a wrong password', function (done) {
    request
      .put('/api/users')
      .send({
        token: userToken,
        password: '123'
      })
      .expect(200, {
        "success": false,
        "message": "The value of password `123` is shorter than the minimum allowed length (4)."
      },
      done);
  });
  it('user sets a correct password', function (done) {
    request
      .put('/api/users')
      .send({
        token: userToken,
        password: '12345'
      })
      .expect(200, {success:true, message: 'Password successfully changed'}, done)
  });

});

describe('DO USER-ONLY ACTIONS', function(){
  it('cannot create a new comm, 403 forbidden', function (done) {
    request
      .post('/api/comms')
      .send({
        "token": userToken,
        "name": "Tienda",
        "location": "Barcelona",
        "activity": "Salud",
        "gps": "(54.49593, 39.91938)",
        "web": "www.example.com",
        "email": "tienda@tienda.com",
        "address": "calle 1, 48",
        "phone": "664664664",
        "description": "Shop description",
      })
      .expect(403, done);
  });
  it('cannot delete a comm, 403 forbidden', function (done) {
    request
      .delete('/api/comms/barcelona_tienda')
      .send( {token: userToken } )
      .expect(403, done);

  });
  it('gets a single comm', function (done) {
    request
      .get('/api/comms/barcelona_tienda')
      .expect(200)
      .end(function(err, res){
        assert.equal(res.body.hasOwnProperty('_id'), true);
        done();
      });
  });

  it('sets a comm as fav', function(done){
    request
      .post('/api/favs')
      .send({
        token: userToken,
        comm_id: 'barcelona_tienda'
      })
      .expect(200, {
        "success": true,
        "message": "Fav added: barcelona_tienda"
      }, done);
  });
  it('UNsets a comm as fav', function(done){
    request
      .delete('/api/favs')
      .send({
        token: userToken,
        comm_id: 'barcelona_tienda'
      })
      .expect(200, {
        "success": true,
        "message": "Fav removed: barcelona_tienda"
      }, done);
  });

  it('sets as a comm admin', function(done){
    request
      .post('/api/ownership')
      .send({
        token: userToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/api/ownership/barcelona_tienda')
          .send({
            token: adminToken
          })
          .expect(200)
          .end(function(err, res){
            assert.equal(res.body.ownership.owners[0] === 'test@user.com', true);
            done();
          });
      });
  });
  it('removes as a comm admin', function(done){
    request
      .delete('/api/ownership')
      .send({
        token: userToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/api/ownership/barcelona_tienda')
          .send({
            token: adminToken
          })
          .expect(200)
          .end(function(err, res){
            assert.equal(res.body.ownership.owners.length == 0, true);
            done();
          });
      });
  });
  it('set as admin of a comm with a wrong ownership key', function(done){
    request
      .post('/api/ownership')
      .send({
        token: userToken,
        key: 12345
      })
      .expect(200, {
        "success": false,
        "message": "Wrong or unexistent ownership key"
      }, done);
  });
  it('removes as admin of a comm with a wrong ownership key', function(done){
    request
      .delete('/api/ownership')
      .send({
        token: userToken,
        key: 12345
      })
      .expect(200, {
        "success": false,
        "message": "Wrong or unexistent ownership key"
      }, done);
  });


});

/*
****************************************
***          SACRIFICE TIME          ***
****************************************
*/

describe('SACRIFICE TIME: USERS AND TEST COMM', function() {
  it('deletes a comm as ADMIN', function (done) {
    request
      .delete('/api/comms/barcelona_tienda')
      .send( {token: adminToken } )
      .expect(200, {
        "message": "Commerce removed from the list!"
      }, done);
  });
  it('normal user cannot delete ANOTHER USER', function (done) {
    request
      .delete('/api/users')
      .send({
        token: userToken,
        email: 'test@admin.com'
      })
      .expect(403, done);
  });
  it('ADMIN deletes himself', function (done) {
    request
      .delete('/api/users')
      .send({
        token: adminToken,
        email: 'test@admin.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });

  it('normal user deletes himself', function (done) {
    request
      .delete('/api/users')
      .send({
        token: userToken,
        email: 'test@user.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });

});
