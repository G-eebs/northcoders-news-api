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
	test("GET:200 sends an object detailing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsFile);
			});
	});
});

describe("/api/articles/:article_id", () => {
	test("GET:200 sends the single article with specified id to the client", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 3,
					title: "Eight pug gifs that remind me of mitch",
					topic: "mitch",
					author: "icellusedkars",
					body: "some gifs",
					created_at: "2020-11-03T09:12:00.000Z",
					votes: 0,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
	test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
		return request(app)
			.get("/api/articles/999")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not Found");
			});
	});
	test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
		return request(app)
			.get("/api/articles/invalid")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Invalid Input");
			});
	});
});
