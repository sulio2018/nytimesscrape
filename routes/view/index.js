// Homepage and Saved Articles routes

const router = require("express").Router();
const db = require("../../models");

router.get("/", (req, res) => {
    db.Headline
    .find({ saved: false })
    .sort({ date: -1 })
    .then(dbArticles => {
        res.render("home", { articles: dbArticles });
    });
});

router.get("/saved", (req, res) => {
    db.Headline
    .find({ saved: true })
    .sort(dbArticles => {
        res.render("saved", { articles: dbArticles });
    });
});

module.exports = router;