const conn = require('../db');
const controller = {};

controller.getStepsCook = (req, res) => {
	const { recipesKey } = req.params;
	const sql = `SELECT stepsOrder, stepsDescription
                 FROM stepsCook
                 WHERE recipesKey = '${recipesKey}'
                 ORDER BY stepsOrder`;

	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}

controller.insertStepsCook = (req, res) => {
	const { recipesKey, stepsDescription } = req.body;
	const sql = `CALL sp_insertStepCook('${recipesKey}', '${stepsDescription}')`;

	runProcess(sql, res);
}

controller.deleteStepsCook = (req, res) => {
	const { recipesKey, stepsOrder } = req.body;
	const sql = `CALL sp_deleteStepCook('${recipesKey}', ${stepsOrder})`;

	runProcess(sql, res);
}

function runProcess(sql, res) {
	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows:rows[0] });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}

module.exports = controller;
