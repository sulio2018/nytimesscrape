$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", deleteArticle);
    $(document).on("click", ".btn.notes", articleNotes);
    $(document).on("click", ".btn.save", saveNote);
    $(document).on("click", ".btn.note-delete", deleteNote);
    $(".clear").on("click", clearArticle);


    function start() {
        $.get("/api/headlines?saved=true").then(function(data) {
            articleContainer.empty();

            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articleInfo = [];

        for (var i = 0; i < articles.length; i++) {
            articleInfo.push(createCard(articles[i]));
        }

        articleContainer.append(articleCards);
    }

    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
                $("<a class='btn btn-info notes'>Article Notes</a>")
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
                "<h4>You don't have any saved articles.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center'>",
                "<h3>Would You Like to Browse Available Articles?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );

        articleContainer.append(emptyAll);
    }

    // Handle notes
    function notesList(data) {
        var notesToRender = [];
        var currentNote;

        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].noteText)
                    .append($("<button class='btn btn-danger note-delete'>x</button>"));
                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }

        $(".note-container").append(notesToRender);
    }

    function deleteArticle() {
        var articleToDelete = $(this)
            .parents(".card")
            .data();

        $(this)
            .parents(".card")
            .remove();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function() {
            if (data) {
                window.load = "/saved"
            }
        });
    }

    // Display notes
    function articleNotes(event) {
        var currentArticle = $(this)
            .parents(".card")
            .data();
            console.log(currentArticle)

        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            console.log(data)

            var modalText =
                $("<div class='container-fluid text-center'>").append(
                    $("<h4>").text("Notes For Article: " + currentArticle._id),
                    $("<hr>"),
                    $("<ul class='list-group note-container'>"),
                    $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                    $("<button class='btn btn-success save'>Save Note</button>")
                );
                console.log(modalText)

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            console.log('noteData:' + JSON.stringify(noteData))

            $(".btn.save").data("article", noteData);

            notesList(noteData);
        });
    }

    function saveNote() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    function deleteNote() {
        var noteToDelete = $(this).data("_id");

        $.ajax({
            method: "DELETE",
            url: "/api/notes/" + noteToDelete,
        }).then(function() {
            bootbox.hideAll();
        });
    }

    function clearArticle() {
        $.get("api/clear").then(function(data) {
            articleContainer.empty();
            location.reload();
        });
    }

}); 