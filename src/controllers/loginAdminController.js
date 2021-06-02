const nanoid = require('nanoid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const conn = require('../db');
const { keyToken } = require('../keys');
const controller = {};

controller.signIn = (req, res) => {
	const { adminName, adminPassword } = req.body;
	const sql = `SELECT adminKey, adminPassword
                 FROM adminSystem
                 WHERE adminName = '${adminName}'`;

	conn.query(sql, (err, rows) => {
		if (!rows.length) {
			res.status(400).json({ message:'No se encontró el correo!' });
			return;
		}

		if (err) {
			res.status(400).json({ status:'error', message:err.sqlMessage });
			return;
		}

		const hashPassword = rows[0].adminPassword;
		const comparePassword = bcrypt.compareSync(adminPassword, hashPassword);

		if (comparePassword) {
			const token = jwt.sign({ userKey:rows[0].adminKey }, keyToken);

			res.status(200).json({
				rows:{
					adminKey:rows[0].adminKey,
					adminToken:token
				}
			});
		} else {
			res.status(400).json({ status:'error', message:'Contraseña incorrecta.' });
		}
	})
};

controller.singUp = (req, res) => {
	const { adminName, adminPassword } = req.body;
	const adminKey = nanoid.nanoid(9);
	const hashPassword = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10));
	const sql = `CALL sp_registerAdmin('${adminKey}', '${adminName}', '${hashPassword}')`;

	conn.query(sql, (err, rows) => {
		if (!err) {
			const adminKey = rows[0][0].adminKey;
			const token = jwt.sign({ adminKey:adminKey }, keyToken);
			
			res.status(200).json({
				rows:{
					adminKey:adminKey,
					adminToken:token
				}
			});
		} else {
			res.status(400).json({ message:err.sqlMessage });
		}
	})
}


module.exports = controller;

