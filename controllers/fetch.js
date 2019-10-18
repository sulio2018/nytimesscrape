const db = require("../models");
const scrape = require("../scripts/scrape");

module.exports = {
    scrapeHeadlines: (req, res) => {
        return scrape()
        .then(articles => {
            return db.Headline.create(articles);
        })
        .then(dbHeadline => {
            if (dbHeadline.length === 0) {
                res.json({
                    message: "No articles to fetch."
                });
            }
            else {
                res.json({
                    message: "Added " + dbHeadline.length + " new articles."
                 });
            }
        })
        .catch(error => {
            res.json({
                message: "Scrape complete!"
            });
        });
    }
};