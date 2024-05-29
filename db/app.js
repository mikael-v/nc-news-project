const express = require('express')
const app = express();

const { getApis } = require('../controllers/api.controllers')
const { getTopics } = require('../controllers/topics.controllers')
const { getArticles, getArticleById } = require('../controllers/articles.controllers')


app.get('/api', getApis)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next)=>{
    if(err.code){
      res.status(400).send({msg: 'Bad request'})
    } else{
      next(err)
    }
  })
  
  app.use((err, req, res, next) =>{
    if(err.msg){
      res.status(err.status).send({msg: err.msg})
    } else{
      next(err)
    }
  })

module.exports = app;