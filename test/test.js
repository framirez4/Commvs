var myApp = require('../server.js');
var should = require('should');
var assert = require('assert');
var request = require('supertest')(myApp);
var adminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InBhc3N3b3JkIjoibW9kaWZ5Iiwicm9sZSI6ImluaXQiLCJmYXZzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInJvbGUiOnRydWUsImZhdnMiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6eyJwYXNzd29yZCI6dHJ1ZX0sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJyb2xlIjoiYWRtaW4iLCJmYXZzIjpbImJpZ3Vlc19lc3NlbmNpYWwiLCJiaWd1ZXNfY2hpbm8iXSwiX192IjowLCJfaWQiOiJmcmFuY2VzY3JhbWlyZXpAZ21haWwuY29tIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGwsbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W119LCJpYXQiOjE0NjIyNzA3MjF9.o5MMhNhOhnADwwmWjXkhfNWiDA1JFp0DuvR9QBclaCk';
var userToken = '';
var ownership = undefined;
var rootDir = '/v1';

describe('LOAD EXPRESS APP', function(){
  it('responds to /', function (done) {
    request
      .get(rootDir)
      .expect(200, done);
  });
  it('404 everything else', function (done) {
    request
      .get('/foo/bar')
      .expect(404, done);
  });
});


describe('User creation functions', function() {

  var creationTests = [
    {
      description: 'a wrong user',
      args: {
        email: 'test',
        first_name: 'test',
        last_name: 'admin',
        password: '1234'
      },
      expected: {
        "success": false,
        "message": {
          "id": {
            "message": "Please fill a valid email address",
            "type": "regexp"
          },
          "password": {
            "message": "The value of password is shorter than the minimum allowed length (6).",
            "type": "minlength"
          }
        }
      }
    },
    {
      description: 'a nameless user',
      args: {
        email: 'test@admin.com',
        password: '123456'
      },
      expected: {
        "success": false,
        "message": {
          "first_name": {
            "message": "Path `first_name` is required.",
            "type": "required"
          },
          "last_name": {
            "message": "Path `last_name` is required.",
            "type": "required"
          }
        }
      }
    },
    {
      description: 'an admin user',
      args: {
        email: 'test@admin.com',
        first_name: 'test',
        last_name: 'admin',
        password: '123456',
        role: 'admin'
      },
      expected: {
        "success": true,
        "message": {
          "en": "New user added!",
          "es": "Nuevo usuario añadido!"
        }
      }
    },
    {
      description: 'a normal user',
      args: {
        email: 'test@user.com',
        first_name: 'test',
        last_name: 'user',
        password: '123456'
      },
      expected: {
        "success": true,
        "message": {
          "en": "New user added!",
          "es": "Nuevo usuario añadido!"
        }
      }
    },
    {
      description: 'a repeated user',
      args: {
        email: 'test@user.com',
        first_name: 'test',
        last_name: 'user',
        password: '123456'
      },
      expected: {
        "success": false,
        "message": "E11000 duplicate key error collection: kapeloi.users index: _id_ dup key: { : \"test@user.com\" }"
      }
    }
  ];

  creationTests.forEach(function(test){
    it('Creates ' + test.description, function(done){
      request
        .post(rootDir + '/users')
        .send(test.args)
        .expect(200, test.expected, done);
    })
  });
});

describe('User authentication process', function(){
  var authTests = [
    {
      description: 'a wrong user',
      args: {
        email: 'test@admin',
        password: '1234'
      },
      expected: {
        "success": false,
        "message": "Authentication failed. User not found."
      }
    },
    {
      description: 'a wrong password',
      args: {
        email: 'test@admin.com',
        password: '1234'
      },
      expected: {
        "success": false,
        "message": "Authentication failed. Wrong password."
      }
    },
    {
      description: 'admin user and get token',
      args: {
        email: 'test@admin.com',
        password: '123456'
      },
      expected: ''
    },
    {
      description: 'normal user and get token',
      args: {
        email: 'test@user.com',
        password: '123456'
      },
      expected: ''
    }
  ];

  authTests.forEach(function(test){
    it('Authenticates ' + test.description, function (done){
      request
        .post(rootDir + '/authenticate')
        .send(test.args)
        .end(function(err, res){
          if(res.body.success === false){
            res.body.should.have.property('message');
            should.equal(res.body.message, test.expected.message)
            done();
          } else if(res.body.success === true){
            res.body.should.have.property('token');
            done();
          }
        })
    });
  });

});

describe('Refresh tokens', function(){
  var refreshTests = [
    {
      description: 'anything, no token at all',
      args: {
        token: ''
      },
      expected: {
        "success": false,
        "message": "No token provided."
      }
    },
    {
      description: 'a wrong token',
      args: {
        token: 'wrongtoken'
      },
      expected: {
        "success": false,
        "message": "Failed to authenticate token."
      }
    }/*,
    {
      description: 'a correct token',
      args: {
        token: adminToken
      },
      expected: ''
    }*/
  ];

  refreshTests.forEach(function(test){
    it('Refreshes ' + test.description, function(done){
      request
        .post(rootDir + '/authenticate/refresh')
        .send(test.args)
        .end(function(err, res){
          if(res.body.success === false){
            should.equal(res.body.message, test.expected.message)
            done();
          } else if(res.body.success === true){
            console.log(res.body);
            res.body.should.have.property('token');
            done();
          }
        })
    });
  });

});

describe('/me opts', function(){
  //ijp
});

describe('Commerce functions', function(){
  it('creates a new comm', function (done) {
    request
      .post(rootDir + '/comms')
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
      .post(rootDir + '/comms')
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
      .get(rootDir + '/comms/barcelona_tienda')
      .expect(200)
      .end(function(err, res){
        res.body.should.have.property('_id');
        done();
      });
  });

});

describe('Set favs and unset', function(){
  it('sets a comm as fav', function(done){
    request
      .post(rootDir + '/favs/barcelona_tienda')
      .send({
        token: adminToken
      })
      .expect(200)
      .end(function(err, res){
        should.equal(res.body.message.en, 'Fav added: Tienda (barcelona_tienda)');
        done();
      });
  });
  it('UNsets a com as fav', function(done){
    request
      .delete(rootDir + '/favs/barcelona_tienda')
      .send({
        token: adminToken
      })
      .expect(200)
      .end(function(err, res){
        should.equal(res.body.message.en, 'Commerce removed from favorites');
        done();
      });
  });
})

describe('Ownership related', function(){
  var ownership = '';

  it('gets a comm ownership key', function(){
    request
      .get(rootDir + '/ownership/barcelona_tienda')
      .send({
        token: adminToken,
      })
      .end(function(err, res){
        console.log(res.body);
        res.body.should.have.property('ownership');
      })
  });
  it('gets a wrong comm ownership key', function(){
    request
      .get(rootDir + '/ownership/barcelona_t')
      .send({
        token: adminToken,
      })
      .expect(200, {
        "success": false,
        "message": "No comm found"
      });
  });

});



describe('User deletion functions', function(){
  it('ADMIN deletes himself', function (done) {
    request
      .delete(rootDir + '/users?email=test@admin.com')
      .send({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InBhc3N3b3JkIjoibW9kaWZ5Iiwicm9sZSI6ImluaXQiLCJmYXZzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInJvbGUiOnRydWUsImZhdnMiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6eyJwYXNzd29yZCI6dHJ1ZX0sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJyb2xlIjoiYWRtaW4iLCJmYXZzIjpbImJpZ3Vlc19lc3NlbmNpYWwiLCJiaWd1ZXNfY2hpbm8iXSwiX192IjowLCJfaWQiOiJmcmFuY2VzY3JhbWlyZXpAZ21haWwuY29tIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGwsbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W119LCJpYXQiOjE0NjIyNzA3MjF9.o5MMhNhOhnADwwmWjXkhfNWiDA1JFp0DuvR9QBclaCk'
      })
      .expect(200, {
        success: true,
        message:
        { en: 'User removed from our database',
          es: 'Usuario eliminado de nuestra base de datos'
        }}, done);
  });
  it('ADMIN deletes teset user', function (done) {
    request
      .delete(rootDir + '/users?email=test@user.com')
      .send({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InBhc3N3b3JkIjoibW9kaWZ5Iiwicm9sZSI6ImluaXQiLCJmYXZzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInJvbGUiOnRydWUsImZhdnMiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6eyJwYXNzd29yZCI6dHJ1ZX0sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJyb2xlIjoiYWRtaW4iLCJmYXZzIjpbImJpZ3Vlc19lc3NlbmNpYWwiLCJiaWd1ZXNfY2hpbm8iXSwiX192IjowLCJfaWQiOiJmcmFuY2VzY3JhbWlyZXpAZ21haWwuY29tIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGwsbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W119LCJpYXQiOjE0NjIyNzA3MjF9.o5MMhNhOhnADwwmWjXkhfNWiDA1JFp0DuvR9QBclaCk'
      })
      .expect(200, {
        success: true,
        message:
        { en: 'User removed from our database',
          es: 'Usuario eliminado de nuestra base de datos'
        }}, done);
  });
});


describe('Admin deletes test comms', function(){
  it('deletes a comm as ADMIN', function (done) {
    request
      .delete(rootDir + '/comms/barcelona_tienda')
      .send( {token: adminToken } )
      .end(function(err, res){
        res.body.should.have.property("removed");
        should.equal(res.body.removed, 'barcelona_tienda');
        done();
      })
  });
});





  /*it('deletes an unexistent user', function (done) {
    request
      .delete('/users')
      .send({
        token: adminToken,
        email: 'test111@admin.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });*/
