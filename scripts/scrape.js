const axios = require("axios");
const cheerio = require("cheerio");

const scrape = () => {
    return axios.get("https://www.nytimes.com")
    .then(res => {
        const $ = cheerio.load(res.data);

        const articles = [];

        $.apply("div.css-1yjtett").each((i, element) => {

            const head = $(element)
            .children("h2")
            .text()
            .trim();

            const url = $(element)
            .children("a")
            .attr("href");

            const sum = $(element)
            .children("p")
            .text()
            .trim();

            if (head && url && sum) {
                const headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                const sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                const addData = {
                    headline: headNeat,
                    summary: sumNeat,
                    url: "https://nytimes.com" + url
                };

                articles.push(addData);
            }
        });
        return articles;
    });
};

module.exports = scrape;