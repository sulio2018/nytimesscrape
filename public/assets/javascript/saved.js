$(document).ready(() => {
    const articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", deleteArticle);
    $(document).on("click", ".btn.notes", articleNotes);
    $(document).on("click", ".btn.save", saveNote);
    $(document).on("click", ".btn.note-delete", deleteNote);
    $(".clear").on("click", clearArticle);


    function start() {
        $.get("/api/headlines?saved=true").then(data => {
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
        const articleInfo = [];

        for (let i = 0; i < articles.length; i++) {
            articleInfo.push(createCard(articles[i]));
        }

        articleContainer.append(articleCards);
    }

    function createCard(article) {
        const card = $("<div class='card'>");
        const cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
                $("<a class='btn btn-info notes'>Article Notes</a>")
            )
        );

        const cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);

        card.data("_id", article._id);

        return card;
    }

    function renderEmpty() {
        const emptyAll = $(
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
        const notesToRender = [];
        const currentNote;

        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        }
        else {
            for (let i = 0; i < data.notes.length; i++) {
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
        const articleToDelete = $(this)
            .parents(".card")
            .data();

        $(this)
            .parents(".card")
            .remove();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(() => {
            if (data) {
                window.load = "/saved"
            }
        });
    }

    // Display notes
    function articleNotes(event) {
        const currentArticle = $(this)
            .parents(".card")
            .data();

        $.get("api/notes/" + currentArticle._id).then(data => {
            console.log(data)

            const modalText =
                $("<div class='container-fluid text-center'>").append(
                    $("<h4>").text("Notes For Article: " + currentArticle._id),
                    $("<hr>"),
                    $("<ul class='list-group note-container'>"),
                    $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                    $("<button class='btn btn-success save'>Save Note</button>")
                );

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            const noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            $(".btn.save").data("article", noteData);

            notesList(noteData);
        });
    }

    function saveNote() {
        const noteData;
        const newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
            $.post("/api/notes/", noteData).then(() => {
                bootbox.hideAll();
            });
        }
    }

    function deleteNote() {
        const noteToDelete = $(this).data("_id");

        $.ajax({
            method: "DELETE",
            url: "/api/notes/" + noteToDelete,
        }).then(() => {
            bootbox.hideAll();
        });
    }

    function clearArticle() {
        $.get("api/clear").then(() => {
            articleContainer.empty();
            location.reload();
        });
    }

}); 