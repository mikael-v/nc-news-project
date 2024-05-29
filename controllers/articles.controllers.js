const { selectArticleById, selectCommentsById }= require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((err) =>{
        next(err)
    })
    
}

exports.getCommentsById = (req, res, next) =>{
    const { article_id } = req.params
    selectCommentsById(article_id)
    .then((comments)=>{
        res.status(200).send([comments])
    })
    .catch((err) =>{
        next(err)
    })
}