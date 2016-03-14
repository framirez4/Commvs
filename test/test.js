var myApp = require('./servertest.js');
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

describe('TEST ADMIN USER', function() {

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

describe('DO ADMIN ACTIONS', function(){
