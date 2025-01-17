const app =  require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json');
const users = require('../db/data/test-data/users.js');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
    test('Returns 200 status code and responds with array containing the correct properties ', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const result = response.body.endpoints;
                const expected = endpoints
                expect(result).toEqual(expected)
            });
    });
});

describe('/api/topics', () => {
    test('Returns 200 status code and responds with array containing the correct properties ', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const topics = response.body.topics
                expect(topics.length).toBe(3);
                topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                  });
            })
    });
});


describe('/api/articles', () => {
    test('Returns 200 status code and responds with array containing the correct properties ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles
            expect(articles.length).toBe(13);
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number), 
                    article_img_url: expect.any(String), 
                    comment_count: expect.any(String)
                })
            });
        })
    });
})

    describe('/api/articles/:article_id', () => {
        test('should respond with a 200 status code and on object containing the correct properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number), 
                    article_img_url: expect.any(String), 
                    comment_count: expect.any(String)
                })
            })      
        });
        test('should return a 404 status code and appropriate message if given a valid but non-existent id number', () => {
            return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('article at given id does not exist')
            })
        });
        test('should return a 400 status code if given an invalid id', () => {
            return request(app)
            .get('/api/articles/banana')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('Bad request')
            })
        });
        test('should return articles in descending order of created date', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toBeSortedBy('created_at', { descending: true })
            });
        });
    });

describe('/api/articles/:article_id/comments', () => {
    test('should respond with a 200 status code and an array of comments with correct properties for the given article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response)=>{
           const commentsArray = response.body.flat()
           expect(commentsArray.length).toBe(11)
           commentsArray.forEach((comment)=>{
            expect(comment).toMatchObject({
                article_id: 1,
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number), 
            })
           })
        })
    });
    test('should return comments in order of most recently created', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.flat()
            expect(comments).toBeSortedBy('created_at', { descending: true })
            
        })
    })
    test('should respond with 404 status code and appropriate message if the article_id is a valid but non-existent one', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('article at given id does not exist')
        })
    });
    test('should return a 400 status code if given an invalid id', () => {
        return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
   test(`should respond with a 201 status code and return a comment with it's properties`, () => {
    const exampleComment = {
        username: users[0].username,
        body: 'This is a great project'
    };
   return request(app)
   .post('/api/articles/1/comments')
   .send(exampleComment)
   .expect(201)
   .then((response) => {
    const comment = response.body.comment;
    expect(Object.keys(comment).length).toBe(6)
    expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        body: exampleComment.body,
        author: exampleComment.username,
        article_id: 1,
        votes: expect.any(Number),
        created_at: expect.any(String)
    });
   }); 
});
test('should respond with a 404 status code and appropriate message if posted by a non-existent user', () => {
    const badExampleComment = {
        username: "non-existent user",
        body: 'This should not post'
    };
    return request(app)
   .post('/api/articles/2/comments')
   .send(badExampleComment)
   .expect(404)
   .then((response) => {
    expect(response.body.msg).toBe('Invalid User')
});
})
test('should respond with a 400 status code if username is missing from the request', () => {
    const badExampleNoUser = {
        body: 'This is a great project'
    };
    return request(app)
        .post('/api/articles/1/comments')
        .send(badExampleNoUser)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });  
});
test('should respond with 400 status code and appropriate message if body is missing from the request', () => {
    const badExampleNoBody = {
        username: users[0].username
    };
    return request(app)
    .post('/api/articles/1/comments')
    .send(badExampleNoBody)
    .expect(400)
    .then((response) => {
        expect(response.body.msg).toBe('Bad request');
    });  
});
    
});


describe('PATCH /api/articles/:article_id', () => {
    test('should respond with a 200 status code and an updated article with new votes', () => {
       const exampleVotes = {inc_votes: 5} 
       return request(app)
       .patch('/api/articles/1')
       .send(exampleVotes)
       .expect(200)
       .then((response)=>{
        const newArticle = response.body.newArticle
        expect(newArticle.length).toBe(1)
        expect(newArticle[0]).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 105,
            article_img_url: expect.any(String)
        });
       })
    });
    test('should reduce voted when given a negative number', () => {
        const exampleVotes = {inc_votes: -5} 
        return request(app)
        .patch('/api/articles/1')
        .send(exampleVotes)
        .expect(200)
        .then((response)=>{
         const newArticle = response.body.newArticle
         expect(newArticle.length).toBe(1)
         expect(newArticle[0]).toMatchObject({
             article_id: 1,
             title: expect.any(String),
             topic: expect.any(String),
             author: expect.any(String),
             body: expect.any(String),
             created_at: expect.any(String),
             votes: 95,
             article_img_url: expect.any(String)
         });
        })
    });
    test(`should respond with a 400 error code and appropriate message if the value of inc_votes isn't a number`, () => {
        const exampleVotes = {inc_votes: 'banana'} 
       return request(app)
       .patch('/api/articles/1')
       .send(exampleVotes)
       .expect(400)
       .then((response)=>{
        expect(response.body.msg).toBe('Bad request')
       })
    });
    test('should respond with a 404 error code and appropriate message if the value of inc_votes is non-existent/undefined', () => {
        const exampleVotes = {} 
        return request(app)
        .patch('/api/articles/1')
        .send(exampleVotes)
        .expect(404)
        .then((response)=>{
         expect(response.body.msg).toBe('Not Found')
    });
})
})

describe('DELETE /api/comments/:comment_id', () => {
    test('should respond with a 204 code and no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response)=>{
            expect(response.body).toEqual({})
        })
    });
    });

    describe('GET /api/users', () => {
        test('should return a 200 status code and respond with an array containing the correct properties ', () => {
           return request(app)
           .get('/api/users')
           .expect(200)
           .then((response)=>{
            const users = response.body
            expect(users.length).toBe(4)
            users.forEach((user)=>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
        });
    })

    describe(' GET /api/articles?topic', () => {
        test('should respond with a 200 status code and articles filtered by a topic', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((response)=>{
            const articles = response.body
            expect(articles.length).toBe(1);
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number), 
                    article_img_url: expect.any(String), 
                    comment_count: expect.any(String)
                })
            });
        })
    });
    test('should respond with 404 and an appropriate message if topic is non-existent', () => {
        return request(app)
            .get('/api/articles?topic=horses')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe(`Topic not found`)
            })
    });
})