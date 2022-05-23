const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index');
})
router.get('/game',(req, res) => {
    res.render('game');
});
router.get('/high',(req, res) => {
    res.render('index');
});

module.exports = router;