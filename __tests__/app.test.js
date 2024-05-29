const app =  require('../db/app')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data')
const endpoints = require('../endpoints.json');
require('jest-sorted')

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
    test('should return articles in descending order of created date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles
        expect(articles).toBeSortedBy('created_at', { descending: true })
    });
});
})