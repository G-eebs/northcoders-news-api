const app = require("../app/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Invalid endpoint", () => {
	test("When given an invalid endpoint returns an appropriate error", () => {
		return request(app)
			.get("/invalid-endpoint")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not Found");
			});
	});
});

describe("/api/topics", () => {
	test("GET:200 sends an array of topic objects to the client", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body: { topics } }) => {
				expect(topics.length).toBe(3);
				topics.forEach((topic) => {
					expect(topic).toHaveProperty("description", expect.any(String));
					expect(topic).toHaveProperty("slug", expect.any(String));
				});
			});
	});
});

describe("/api", () => {
	test("GET:200 returns an object detailing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsFile);
			});
	});
});
