const { selectArticles, selectArticleById, selectCommentsById, writeCommentOnArticle, changeVotes, removeComment }= require('../models/articles.models')

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
}; 


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




exports.postCommentOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    if (!username || !body) {
        return res.status(400).send({msg: 'Bad request'});
    }
    return writeCommentOnArticle(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

exports.updateVotes = (req, res, next) =>{
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if(!inc_votes ){
        res.status(404).send({msg: 'Not Found'})
    }
    return changeVotes({inc_votes}, article_id)
    .then((newArticle)=>{
        res.status(200).send({newArticle})
    })
    .catch((err) => {
        next(err);
    });
}

exports.deleteComment = (req, res, next) =>{
    const comment_id = req.params.comment_id
    if(!comment_id){
        res.status(404).send({msg: "Comment not Found"})
    }
    return removeComment(comment_id)
    .then(()=>{
        res.status(204).send({})
    })
    .catch((err) => {
        next(err);
    });
}

