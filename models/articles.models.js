const db = require('../db/connection')

exports.selectArticles = () =>{
    return db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
`)
.then((result)=>{
        return result.rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.body, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article at given id does not exist'})
        }
        return result.rows[0]
    })

}

exports.selectCommentsById = (article_id) =>{
    return db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC`, [article_id])
.then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article at given id does not exist'})
        }
        return result.rows
    })
}

exports.writeCommentOnArticle = (article_id, username, body) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Invalid User' });
        }
        const query = `
            INSERT INTO comments (article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        return db.query(query, [article_id, username, body]);
    })
    .then((result) => {
        return result.rows[0];
    });
};

exports.changeVotes = ({ inc_votes: newVote }, article_id)=>{
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *;` , [newVote, article_id])
        .then((result)=>{
            return result.rows
        })
}

exports.removeComment = (comment_id) =>{
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
}
  
exports.selectUsers = () =>{
    return db.query(`SELECT * FROM users`)
    .then((result)=>{
        return result.rows
    })
}