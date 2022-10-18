'use strict'

const Mongodb = require('@pick-star/cli-mongodb')

const {mongodbName, mongodbUrl } = require('../../config/db')

function mongo() {
    return new Mongodb(mongodbName,mongodbUrl)
}
module.exports = mongo