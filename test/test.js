var myApp = require('./servertest.js');
var assert = require('assert');
var request = require('supertest')(myApp);
var adminToken = '';
var userToken = '';

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

describe('TEST ADMIN USER test@test.com', function() {

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
        email: 'test@test.com',
        password: '1234',
        role: 'admin'
      })
      .expect(200, {"success":true,"message":"New user added!"}, done);
  });
  it('creates a duplicate user', function (done) {
    request
      .post('/api/users')
      .send({
        email: 'test@test.com',
        password: '1234',
        role: 'admin'
      })
      .expect(200, {
        "success": false,
        "message": "E11000 duplicate key error index: commvs.users.$_id_ dup key: { : \"test@test.com\" }"
      }, done);
  });
  it('authenticates an admin user', function (done){
    request
      .post('/api/authenticate')
      .send({
        email: 'test@test.com',
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
        email: 'test111@test.com'
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
  it('gets a comm', function (done) {
    request
      .get('/api/comms/barcelona_tienda')
      .expect(200)
      .end(function(err, res){
        assert.equal(res.body.hasOwnProperty('_id'), true);
        done();
      });
  });

  it('sets a com as fav', function(done){
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
  it('sets a com as fav', function(done){
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

  it('deletes a comm', function (done) {
    request
      .delete('/api/comms/barcelona_tienda')
      .send( {token: adminToken } )
      .expect(200, {
        "message": "Commerce removed from the list!"
      }, done);

  });

});

describe('SACRIFICE ADMIN USER test@test.com', function() {
  it('admin deletes a user', function (done) {
    request
      .delete('/api/users')
      .send({
        token: adminToken,
        email: 'test@test.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });
});
