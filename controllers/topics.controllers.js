const topics = require('../db/data/development-data')
const { selectTopics }= require('../models/topics.models')

exports.getTopics = (req, res, next) => {
    res.status(200).send({topics})
}