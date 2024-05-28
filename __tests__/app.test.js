const app =  require('../db/app')
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
    test('Returns status code 200 when GET request to /api/topics is made', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    });
    test('Responds with array containing the correct properties ', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const topicsData = response.body.topics.topicData
                expect(topicsData.length).toBe(3);
                topicsData.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                  });
            })
    });
});
