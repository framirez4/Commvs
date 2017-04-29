/* eslint-env mocha */
'use strict'

require('dotenv').config()
require('../../database')

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const Users = require('./users')

describe('User module', () => {
  it('should export an object', () => {
    expect(Users).to.be.a('Object')
  })
})

    // it('should return a Promise', function () {
    //   const usersUp = Users.up()
    //   expect(usersUp.then).to.be.a('Function')
    //   expect(usersUp.catch).to.be.a('Function')
    // })

    // it('should return a Promise', function * () {
    //   yield Users.up()
    //   expect(usersUp.then).to.be.a('Function')
    //   expect(usersUp.catch).to.be.a('Function')
    // })
// describe('Save user', () => {
//   it('should return a user object', () => {
//     const userMock = {
//       email: 'test@test.com',
//       firstName: 'John',
//       lastName: 'Doe',
//       password: 'password'
//     }
//
//     expect(Users.postUsers(Object.assign({}, userMock))).to.not.have.property('_id')
//   })
// })
