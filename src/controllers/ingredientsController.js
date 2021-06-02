const conn = require('../db');
const controller = {};

controller.getIngredients = (req, res) => {
	const { recipesKey } = req.params;
	const sql = `SELECT ingredientsOrder, ingredientsName, ingredientsAmount
                 FROM ingredients
                 WHERE recipesKey = '${recipesKey}'
                 ORDER BY ingredientsOrder`;

	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}

controller.insertIngredient = (req, res) => {
	const { recipesKey, ingredientsName, ingredientsAmount } = req.body;
	const sql = `CALL sp_insertIngredient('${recipesKey}', '${ingredientsName}', '${ingredientsAmount}')`;

	runProcess(sql, res);
}

controller.deleteIngredient = (req, res) => {
	const { recipesKey, ingredientsOrder } = req.body;
	const sql = `CALL sp_deleteIngredient('${recipesKey}', ${ingredientsOrder})`;

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
