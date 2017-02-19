'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  SECRET: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  secret: {
    simpleKey: envVars.SECRET
  }
}

module.exports = config
