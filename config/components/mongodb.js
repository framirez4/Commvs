'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  DB_HOST: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  mongodb: {
    uri: envVars.DB_HOST
  }
}

module.exports = config
