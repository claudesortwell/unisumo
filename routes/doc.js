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
    
    Subject.find({ownedUser: req.user._id})
        .then(subject => {
            Document.findOne({_id: req.params.id, ownedBy: req.user._id})
                .then(document => {
                    if(document == null) {
                        res.redirect('/404');
                    } else {
                        readModuleFile("../sumodocs/" + req.user._id + "/doc/" + req.params.id + "/" + document.docTextVersion + '.txt', function (err, words) {
                            res.render('docs', {
                                layout: 'dashboardlayout',
                                name: req.user.name,
                                email: req.user.email,
                                uni: req.user.uni,
                                subjects: subject,
                                docText: words,
                                document: document,
                                darkmode: req.user.darkMode,
                                title:'docs'
                            });
                        });
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

    // let firstDate = new Date("7/13/2016"),
    // secondDate = new Date("09/15/2017"),
    // timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
    
    // console.log(timeDifference);
   
});

// Document saver
router.post('/savedoc', ensureAuthenticated, ensureActiveSub, function(req, res){
    Document.findOne({_id: req.body.docId, ownedBy: req.user._id}).then(document => {
        document.docName = req.body.docName;
        document.docTextVersion = String(parseInt(document.docTextVersion, 10) + 1);
        document.save();

        fs.writeFileSync("./sumodocs/" + req.user._id + "/doc/" + document._id + "/" + document.docTextVersion + ".txt", req.body.docText);
    });
    
    res.end('{"success" : "Updated Successfully", "status" : 200}');
});

// Create a new document
router.get('/new', ensureAuthenticated, ensureActiveSub, function(req, res) {
    var docName = 'New Document';
    var docTextVersion = '0';
    var ownedBy = req.user._id;
    var sharedWith = '';

    const newDocument = new Document({
        docName,
        docTextVersion,
        ownedBy, 
        sharedWith,
    });

    newDocument.save()
        .then(document => {
            fs.mkdirSync("./sumodocs/" + req.user._id + "/doc/" + document._id + "/");
            fs.writeFileSync("./sumodocs/" + req.user._id + "/doc/" + document._id + "/" + document.docTextVersion + ".txt", '');
            res.redirect('/doc/ed' + document._id);
        })
        .catch(err => console.log(err)); 
});

module.exports = router;