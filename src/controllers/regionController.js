const nanoid = require('nanoid');
const conn = require('../db');
const controller = {};

controller.getRegion = (req, res) => {
	const { type } = req.params;
	const sql = `SELECT regionKey, regionName, regionStatus
                 FROM region
                 WHERE regionStatus = ${type}`;

	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}

controller.insertRegion = (req, res) => {
	const { regionName } = req.body;
	const regionKey = nanoid.nanoid(9);
	const sql = `CALL sp_insertRegion('${regionKey}', '${regionName}')`;

	runProcess(sql, res);
}

controller.updateRegion = (req, res) => {
	const { regionKey, regionName } = req.body;
	const sql = `CALL sp_updateRegion('${regionKey}', '${regionName}')`;

	runProcess(sql, res);
}

controller.updateStatusRegion = (req, res) => {
	const { regionKey, regionStatus } = req.body;
	const newRegionsStatus = (regionStatus === 1 ? 0 : 1);
	const sql = `CALL sp_updateStatusRegion('${regionKey}', ${newRegionsStatus})`;

	runProcess(sql, res);
}

function runProcess(sql, res) {
	conn.query(sql, (err, rows) => {
		if (!err)
			res.status(200).json({ rows: rows[0] });
		else
			res.status(400).json({ message:err.sqlMessage });
	});
}

module.exports = controller;
