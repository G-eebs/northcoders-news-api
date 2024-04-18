const app = require("../app/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Integration tests", () => {
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
		describe("GET", () => {
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
	});

	describe("/api", () => {
		describe("GET", () => {
			test("GET:200 sends an object detailing all available endpoints", () => {
				return request(app)
					.get("/api")
					.expect(200)
					.then(({ body: { endpoints } }) => {
						expect(endpoints).toEqual(endpointsFile);
					});
			});
		});
	});

	describe("/api/articles/:article_id", () => {
		describe("GET", () => {
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
			test("GET:200 article sent to client includes comment_count property", () => {
				return request(app)
					.get("/api/articles/3")
					.expect(200)
					.then(({ body: { article } }) => {
						expect(article).toHaveProperty("comment_count", 2);
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
						expect(msg).toBe("Invalid Request");
					});
			});
		});
		describe("PATCH", () => {
			test("PATCH:200 increases or decreases the specified article's vote count by the requested amount, returning the updated article", () => {
				return request(app)
					.patch("/api/articles/2")
					.send({ inc_votes: 8 })
					.expect(200)
					.then(({ body: { updatedArticle } }) => {
						expect(updatedArticle).toMatchObject({
							article_id: 2,
							title: "Sony Vaio; or, The Laptop",
							topic: "mitch",
							author: "icellusedkars",
							body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
							created_at: "2020-10-16T05:03:00.000Z",
							votes: 8,
							article_img_url:
								"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
						});
					});
			});
			test("PATCH:200 ignores unnecessary properties on the request object", () => {
				return request(app)
					.patch("/api/articles/2")
					.send({ inc_votes: 8, dec_money: 1000, change_author: "Paul" })
					.expect(200)
					.then(({ body: { updatedArticle } }) => {
						expect(updatedArticle).toMatchObject({
							article_id: 2,
							title: "Sony Vaio; or, The Laptop",
							topic: "mitch",
							author: "icellusedkars",
							body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
							created_at: "2020-10-16T05:03:00.000Z",
							votes: 8,
							article_img_url:
								"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
						});
					});
			});
			test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
				return request(app)
					.patch("/api/articles/999")
					.send({ inc_votes: 8 })
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Not Found");
					});
			});
			test("PATCH:400 sends an appropriate status and error message when given an invalid article id", () => {
				return request(app)
					.patch("/api/articles/invalid")
					.send({ inc_votes: 8 })
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
			test("PATCH:400 sends an appropriate status and error message when given a malformed comment object", () => {
				return request(app)
					.patch("/api/articles/2")
					.send({ inc_vowtes: 8 })
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
			test("PATCH:400 sends an appropriate status and error message when given a comment object with incorrect data types", () => {
				return request(app)
					.patch("/api/articles/2")
					.send({ inc_votes: "inc by 8" })
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
		});
	});

	describe("/api/articles", () => {
		describe("GET", () => {
			test("GET:200 sends an array of article objects, with a comment count and no body property, to the client", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles.length).toBe(13);
						articles.forEach((article) => {
							expect(article).toMatchObject({
								article_id: expect.toBeNumber(),
								title: expect.toBeString(),
								topic: expect.toBeString(),
								author: expect.toBeString(),
								created_at: expect.toBeString(),
								votes: expect.toBeNumber(),
								article_img_url: expect.toBeString(),
								comment_count: expect.toBeNumber(),
							});
							expect(article).not.toHaveProperty("body");
						});
					});
			});
			test("GET:200 sent array should be ordered by date in descending order", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("created_at", { descending: true });
					});
			});
			test("GET:200 endpoint should accept a topic query which filters result to only the specified topic", () => {
				return request(app)
					.get("/api/articles?topic=cats")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles.length).toBe(1);
						articles.forEach(({ topic }) => {
							expect(topic).toBe("cats");
						});
					});
			});
			test("GET:200 sends an empty array when provided with a topic that doesn't have any articles", () => {
				return request(app)
					.get("/api/articles?topic=dogs")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toEqual([]);
					});
			});
		});
	});

	describe("/api/articles/:article_id/comments", () => {
		describe("GET", () => {
			test("GET:200 sends an array of all comments for the specified article id", () => {
				return request(app)
					.get("/api/articles/5/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments.length).toBe(2);
						comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.toBeNumber(),
								votes: expect.toBeNumber(),
								created_at: expect.toBeString(),
								author: expect.toBeString(),
								body: expect.toBeString(),
								article_id: expect.toBeNumber(),
							});
						});
					});
			});
			test("GET:200 comments should be ordered with the most recent first", () => {
				return request(app)
					.get("/api/articles/5/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toBeSortedBy("created_at", { descending: true });
					});
			});
			test("GET:200 should send an empty array if an article has no comments but does exist", () => {
				return request(app)
					.get("/api/articles/2/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toEqual([]);
					});
			});
			test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
				return request(app)
					.get("/api/articles/999/comments")
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Not Found");
					});
			});
			test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
				return request(app)
					.get("/api/articles/invalid/comments")
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
		});
		describe("POST", () => {
			test("POST:201 adds a new comment to the specified article and sends the comment back to the client", () => {
				const expectedComment = {
					comment_id: 19,
					body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					article_id: 4,
					author: "rogersop",
					votes: 0,
					created_at: expect.toBeString(),
				};
				return request(app)
					.post("/api/articles/4/comments")
					.send({
						username: "rogersop",
						body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(201)
					.then(({ body: { postedComment } }) => {
						expect(postedComment).toMatchObject(expectedComment);
						return request(app).get("/api/articles/4/comments").expect(200);
					})
					.then(({ body: { comments } }) => {
						expect(comments).toContainEqual(expectedComment);
					});
			});
			test("POST:201 ignores unnecessary properties on request body", () => {
				return request(app)
					.post("/api/articles/4/comments")
					.send({
						username: "rogersop",
						body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
						votes: 500,
						permanent: true,
					})
					.expect(201)
					.then(({ body: { postedComment } }) => {
						expect(postedComment).toMatchObject({
							comment_id: 19,
							body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
							article_id: 4,
							author: "rogersop",
							votes: 0,
							created_at: expect.toBeString(),
						});
					});
			});
			test("POST:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
				return request(app)
					.post("/api/articles/999/comments")
					.send({
						username: "rogersop",
						body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Not Found");
					});
			});
			test("POST:400 sends an appropriate status and error message when given an invalid article id", () => {
				return request(app)
					.post("/api/articles/invalid/comments")
					.send({
						username: "rogersop",
						body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
			test("POST:400 sends an appropriate status and error message when given a malformed comment object", () => {
				return request(app)
					.post("/api/articles/4/comments")
					.send({
						username: "rogersop",
						comment:
							"Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
			test("POST:400 sends an appropriate status and error message when given a comment object with incorrect data types", () => {
				return request(app)
					.post("/api/articles/4/comments")
					.send({
						username: 42785,
						comment:
							"Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
			test("POST:404 sends an appropriate status and error message when given a comment with a user that doesn't exist", () => {
				return request(app)
					.post("/api/articles/4/comments")
					.send({
						username: "grumpy19",
						body: "Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.",
					})
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Not Found");
					});
			});
		});
	});

	describe("/api/comments/:comment_id", () => {
		describe("DELETE", () => {
			test("DELETE:204 deletes the specified comment, returning no content", () => {
				return request(app)
					.delete("/api/comments/3")
					.expect(204)
					.then(({ text }) => {
						expect(text).toBe("");
					})
					.then(() => {
						return request(app).get("/api/articles/1/comments");
					})
					.then(({ body: { comments } }) => {
						expect(comments).not.toContainEqual({
							comment_id: 3,
							body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
							article_id: 1,
							author: "icellusedkars",
							votes: 100,
							created_at: "2020-03-01T01:13:00.000Z",
						});
					});
			});
			test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent comment id", () => {
				return request(app)
					.delete("/api/comments/999")
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Comment Not Found");
					});
			});
			test("DELETE:400 sends an appropriate status and error message when given an invalid comment id", () => {
				return request(app)
					.delete("/api/comments/invalid")
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid Request");
					});
			});
		});
	});
	describe("/api/users", () => {
		describe("GET", () => {
			test("GET:200 sends an array of all user objects to the client", () => {
				return request(app)
					.get("/api/users")
					.expect(200)
					.then(({ body: { users } }) => {
						expect(users.length).toBe(4);
						users.forEach((user) => {
							expect(user).toMatchObject({
								username: expect.toBeString(),
								name: expect.toBeString(),
								avatar_url: expect.toBeString(),
							});
						});
					});
			});
		});
	});
});
