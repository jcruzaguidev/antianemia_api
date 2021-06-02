const nanoid = require('nanoid');
const conn = require('../db');
const controller = {};

controller.getRecipe = (req, res) => {
	const { type } = req.params;
	const sql = `SELECT a.recipesKey,
                        a.regionKey,
                        b.regionName,
                        a.recipesName,
                        a.recipesDescription,
                        a.recipesTimeCook,
                        a.recipesFavorite,
                        a.recipesStatus
                 FROM recipes a
                          INNER JOIN region b ON a.regionKey = b.regionKey
                 WHERE a.recipesStatus = ${type};`;

	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}


controller.insertRecipe = (req, res) => {
	const { regionKey, recipesName, recipesDescription, recipesTimeCook } = req.body;
	const recipesKey = nanoid.nanoid(9);
	const sql = `CALL sp_insertRecipe('${recipesKey}', '${regionKey}', '${recipesName}', '${recipesDescription}', '${recipesTimeCook}')`;

	runProcess(sql, res);
}

controller.updateRecipe = (req, res) => {
	const { recipesKey, regionKey, recipesName, recipesDescription, recipesTimeCook } = req.body;
	const sql = `CALL sp_updateRecipe('${recipesKey}', '${regionKey}', '${recipesName}', '${recipesDescription}', '${recipesTimeCook}')`;

	runProcess(sql, res);
}

controller.updateStatusRecipe = (req, res) => {
	const { recipesKey, recipesStatus } = req.body;
	const newRecipesStatus = (recipesStatus === 1 ? 0 : 1);
	const sql = `CALL sp_updateStatusRecipe('${recipesKey}', ${newRecipesStatus})`;

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
