$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", saveArticle);
    $(document).on("click", ".scrape-new", scrapeArticle);
    $(".clear").on("click", clearArticle);

    // Handle headlines
    function start() {
        $.get("/api/headlines?saved=false").then(function(data) {
            articleContainer.empty();

            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    // Append articles
    function renderArticles(articles) {
        var articleInfo = [];

        for (var i = 0; i < articles.length; i++) {
            articleInfo.push(createCard(articles[i]));
        }

        articleContainer.append(articleCards);
    }

    // Create article card
    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-success save'>Save Article</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);

        card.data("_id", article._id);

        return card;
    }

    function renderEmpty() {
        var emptyAll = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>You don't have any new articles.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );

        articleContainer.append(emptyAll);
    }

    function saveArticle() {
        var articleToSave = $(this)
            .parents(".card")
            .data();

        $(this)
            .parents(".card")
            .remove();

        articleToSave.saved = true;
        console.log(articleToSave)

        $.ajax({
            method: "PUT",
            url: "/api/headlines/" + articleToSave._id,
            data: articleToSave
        }).then(function(data) {
            console.log(data)
            if (data) {
                location.reload();
            }
        });
    }

    function scrapeArticle() {
        $.get("/api/fetch").then(function(data) {
            console.log(data)
            window.location.href = "/";
        });
    }

    function clearArticle() {
        $.get("api/clear").then(function(data) {
            console.log(data)
            articleContainer.empty();
            location.reload();
        });
    }

});