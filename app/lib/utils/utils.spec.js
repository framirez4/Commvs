/* eslint-env mocha */
'use strict'

require('dotenv').config()
require('../../database')

const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const Utils = require('./utils')

describe('Utils module', () => {
  it('should export an object', () => {
    expect(Utils).to.be.a('Object')
  })

  it('should return a spy', () => {
    var filterValidationModelErrorsSpy = sinon.spy(Utils, 'filterValidationModelErrors')

    Utils.filterValidationModelErrors({})

    console.log(filterValidationModelErrorsSpy.called)

    filterValidationModelErrorsSpy.restore()

    expect(filterValidationModelErrorsSpy.called)
  })
})
