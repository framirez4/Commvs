/* eslint-env mocha */
'use strict'

require('dotenv').config()
require('../../database')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const Users = require('./users')

describe('User module', () => {
  describe('Users is up', () => {
    it('should export a function', () => {
      expect(Users.up).to.be.a('Function')
    })

    it('should return a Promise', function * () {
      const usersUp = Users.up()
      expect(usersUp.then).to.be.a('Function')
      expect(usersUp.catch).to.be.a('Function')
    })

    // it('should return a Promise', function * () {
    //   yield Users.up()
    //   expect(usersUp.then).to.be.a('Function')
    //   expect(usersUp.catch).to.be.a('Function')
    // })
  })
})
