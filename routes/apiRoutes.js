const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {

    // Route to Home Page
    app.get("/", (req, res) => {
        db.Article.find({ saved: false }, (err, data) => {
            res.render("home", { home: true, article: data });
        })
    });

    // Route to Saved Page
    app.get("/saved'", (req, res) => {
        db.Article.find({ saved: true }), (err, data) => {
            res.render("saved", { home: false, article: data });
        }
    });

    // Save article to db
    app.put("/api/headlines/:id", (req, res) => {
        let saved = req.body.saved == "true"

        if (saved) {
            db.Article.updateOne({ _id: req.body._id }, { $set: { saved: true } }, (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    return res.send(true)
                }
            });
        }
    });

    // Delete article from db
    app.delete("/api/headlines/:id", (req, res) => {
        db.Article.deleteOne({ _id: req.params.id}, (err, res) => {
            if (err) {
                console.log(err)
            }
            else {
                return res.send(true)
            }
        });
    });

    // SCRAPE ARTICLES
    app.get("/api/fetch", (req, res) => {

        axios.get("https://nytimes.com/").then(response => {
            const $ = cheerio.load((i, element) => {

                let result = {};
                result.headline = $(element).find("h2").text().trim();
                result.url = "https://www.nytimes.com" + $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim();

                if (result.headline !== '' && result.summary !== '') {
                    db.Article.findOne({ headline: result.headline}, (req, data) => {

                        if (err) {
                            console.log(err)
                        }
                        else {
                            if (data === null) {
                                db.Article.create(result).then(dbArticle => {
                                    console.log(dbArticle)
                                })
                                .catch(err => {
                                    console.log(err)
                                });
                            }
                        }
                    });
                }
            });

            res.send("Scrape Completed!");
        });
    });

    // Get notes for articles
    app.get("/api/notes/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id})
        .populate("note")
        .then(dbArticle => {
            res.json(dbArticle.note)
        })
        .catch(err => {
            res.json(err)
        })
    });

    // Add notes to an article
    app.post("/api/notes", (req, res) => {
        db.Note.create({ noteText: req.body.noteText })
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.body._headline},
                { $push: {note: dbNote._id } },
                { new: true })
        })
        .then(dbArticle => {
            res.json(dbArticle)
        })
        .catch(err => {
            res.json(err);
        })
    });

    // Delete note
    app.delete("/api/notes/:id", (req, res) => {
        db.Note.deleteOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                return res.send(true)
            }
        });
    });

    // Clear everything from db
    app.get("/api/clear", (req, res) => {
        db.Article.deleteMany({}, (req,result) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(result)
                res.send(true)
            }
        })
    });
}