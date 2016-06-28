describe('DO ADMIN-ONLY ACTIONS', function(){




  it('sets as a comm admin', function(done){
    request
      .post('/ownership')
      .send({
        token: adminToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/ownership/barcelona_tienda')
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
      .delete('/ownership')
      .send({
        token: adminToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/ownership/barcelona_tienda')
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
      .post('/ownership')
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
      .delete('/ownership')
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

  it('authenticates a normal user', function (done){
    request
      .post('/authenticate')
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
      .put('/users')
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
      .put('/users')
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
      .post('/comms')
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
      .delete('/comms/barcelona_tienda')
      .send( {token: userToken } )
      .expect(403, done);

  });
  it('gets a single comm', function (done) {
    request
      .get('/comms/barcelona_tienda')
      .expect(200)
      .end(function(err, res){
        assert.equal(res.body.hasOwnProperty('_id'), true);
        done();
      });
  });

  it('sets a comm as fav', function(done){
    request
      .post('/favs')
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
      .delete('/favs')
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
      .post('/ownership')
      .send({
        token: userToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/ownership/barcelona_tienda')
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
      .delete('/ownership')
      .send({
        token: userToken,
        key: ownership
      }).end(function(err, res){
        request
          .get('/ownership/barcelona_tienda')
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
      .post('/ownership')
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
      .delete('/ownership')
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
  /*it('deletes a comm as ADMIN', function (done) {
    request
      .delete('/comms/barcelona_tienda')
      .send( {token: adminToken } )
      .expect(200, {
        "message": "Commerce removed from the list!"
      }, done);
  });*/
  it('normal user cannot delete ANOTHER USER', function (done) {
    request
      .delete('/users')
      .send({
        token: userToken,
        email: 'test@admin.com'
      })
      .expect(403, done);
  });
  it('ADMIN deletes himself', function (done) {
    request
      .delete('/users')
      .send({
        token: adminToken,
        email: 'test@admin.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });

  it('normal user deletes himself', function (done) {
    request
      .delete('/users')
      .send({
        token: userToken,
        email: 'test@user.com'
      })
      .expect(200, {"message": "User removed from our database"}, done);
  });

});
