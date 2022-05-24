const controller = {};

//Controllers
controller.highscore = (req, res) => {
    const sql = "SELECT nickname, sum(money) AS earnings " +
        "FROM games " +
        "GROUP BY nickname " +
        "ORDER BY earnings DESC ";
    "LIMIT 10";

    req.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            res.send(rows)
        })
    })
}

controller.winning = (req, res) => {
    const { name, money } = req.params;
    const sql =
        "Insert into games (date,nickname,money) " +
        "values (NOW(), '" + name + "'," + money + ");";

    if(isNaN(money)){
        res.sendStatus(501)
        return;
    }
    req.getConnection((err, conn) => {
        conn.query(sql, (err) => {
            res.sendStatus(201)
        })
    })
}

module.exports = controller;