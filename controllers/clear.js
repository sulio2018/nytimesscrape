const db = require("../models");

module.exports = {
    clearDB: (req, res) => {
        db.Headline.remove({})
        .then(() => {
            return db.Note.remove({});
        })
        .then(() => {
            res.json({ ok: true });
        })
        .catch(error => {
            console.log(error);
        });
    }
};