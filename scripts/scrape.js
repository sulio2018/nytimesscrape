const axios = require("axios");
const cheerio = require("cheerio");

const scrape = () => {
    return axios.get("https://www.nytimes.com/")
    .then(res => {
        const $ = cheerio.load(res.data);

        $("article").each((i, element) => {
            const result = {};

            result.headline = $(element).find("h2").text().trim();
            result.url = 'https://nytimes.com' + $(element).find("a").attr("href");
            result.summary = $(element).find("p").text().trim();

            if (result.headline !== '' && result.summary !== '') {
                db.Article.findOne({ headline: result.headline}, (err, data) => {

                    if (err) {
                        console.log(err)
                    }
                    else {
                        if (data === null) {
                            db.Article.create(result)
                            .then(dbArticle => {
                                console.log(dbArticle)
                            })
                            .catch(err => {
                                console.log(err)
                            });
                        }

                        console.log(data)
                    }
                });
            }
        });

        res.send("Scrape completed!");
    });
};

module.exports = scrape;