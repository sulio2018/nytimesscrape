const db = require("../models");

module.exports = {
    findAll: (req, res) => {
        db.Headline
        .find(req.query)
        .sort({ date: -1 })
        .then(dbHeadline => {
            res.json(dbHeadline);
        });
    },

    delete: (req, res) => {
        db.Headline
        .remove({ _id: req.params.id })
        .then(dbHeadline => {
            res.json(dbHeadline);
        });
    },

    update: (req, res) => {
        db.Headline
        .findOneAndUpdate({ _id: req.params.id }, 
            { $set: req.body }, 
            { new: true })
            .then(dbHeadline => {
            res.json(dbHeadline);
        });
    }
};