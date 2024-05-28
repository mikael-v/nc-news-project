const app = require('../api.app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
    test('Returns 200 status code and responds with array containing the correct properties ', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const apis = response.body;
                const endpoints = apis.endpoints
                expect(apis).toHaveProperty('endpoints');
                expect(typeof endpoints).toBe('object');
                Object.entries(apis.endpoints).forEach(([endpoint, data]) => {
                    expect(data).toHaveProperty('description', expect.any(String));

                    if ('queries' in data) {
                        expect(Array.isArray(data.queries)).toBe(true);
                    }

                    if ('exampleResponse' in data){
                        expect(typeof data.exampleResponse).toBe('object')
                    }
                });
            });
    });
});