const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureActiveSub } = require('../config/auth');
const fs = require("fs");

function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

// Document router
router.get('/ed:id', ensureAuthenticated, ensureActiveSub, function(req, res) {
    
    // Subject.find({ownedUser: req.user._id})
    //     .then(subject => {
    //         sub = subject;
    //     })
    //     .catch(err => console.log(err));

    let sub = null;
    let docText;

    Document.findOne({_id: req.params.id, ownedBy: req.user._id})
        .then(document => {
            if(document == null) {
                res.redirect('/404');
            } else {
                readModuleFile("../sumodocs/" + req.user._id + "/" + req.params.id + '.txt', function (err, words) {
                    res.render('docs', {
                        layout: 'dashboardlayout',
                        name: req.user.name,
                        email: req.user.email,
                        uni: req.user.uni,
                        subjects: sub,
                        docText: words,
                        document: document,
                        darkmode: req.user.darkMode,
                        title:'docs'
                    });
                });
            }
        })
        .catch(err => console.log(err));
   
});

// Document saver
router.post('/savedoc', ensureAuthenticated, ensureActiveSub, function(req, res){
    let doc = {};

    console.log(req.body.docId, req.body.docName);
    doc.docName = req.body.docName;
    doc.docText = req.body.docText;

    Document.updateOne({_id: req.body.docId, ownedBy: req.user._id}, {$set: {docName: req.body.docName, docText: req.body.docText}}, 
        function(err){
            if(err){
                console.log(err);
            } else {
                console.log(err);  
            }
        }
    );

    var dir = "./sumodocs/" + req.user._id + "/";

    if (fs.existsSync(dir)) {
        fs.writeFile(dir + req.body.docId + ".txt", req.body.docText, (err) => {
            if (err){
                console.log(err);
            } 
            console.log("Successfully Written to File.");
        });
    } else {
        fs.mkdirSync(dir);
        fs.writeFile("./sumodocs/" + req.user._id + "/" + req.body.docId + ".txt", req.body.text, (err) => {
            if (err){
                console.log(err);
            } 
            console.log("Successfully Written to File.");
        });
    }
});

module.exports = router;