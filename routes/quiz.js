const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

module.exports = (db) => {

 router.post('/create', (req, res) => {
     // Add a new kwiz
    const kwiz = req.body;
    console.log("id is" , req.cookies.id);
    kwiz.userId = req.cookies.id;
    console.log(kwiz);
    if (kwiz.private = 'on') {
      kwiz.public = false;
    } else {
      kwiz.public = true;
    }
    db.addKwiz(kwiz);
  });

  router.get('/:id', (req, res) => {
    const quizId = req.params.id;
    db.addQuiz(user)
      .then(user => {
        if (!user) {
          res.send({ error: "error" });
          return;
        }
        res.cookie('id', user.id);
        res.send("🤗");
      })
      .catch(e => res.send(e));
  });
  return router;
};
