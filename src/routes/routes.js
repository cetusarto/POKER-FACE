const router = require('express').Router();

const controller = require('./controllers.js');


//Routes
router.get('/', (req, res) => {
    res.render('index');
})
router.get('/game', (req, res) => {
    res.render('game');
});
router.get('/high', (req, res) => {
    res.render('high')
});

router.get('/highDB', controller.highscore);
router.post('/highDB/:name/:money', controller.winning);






module.exports = router;