const nanoid = require('nanoid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const conn = require('../db');
const { keyToken } = require('../keys');
const controller = {};

controller.signIn = (req, res) => {
	const { userMail, userPassword } = req.body;
	const sql = `SELECT a.userKey, a.userName, b.userPassword
                 FROM user a
                          INNER JOIN userCredential b ON a.userKey = b.userKey
                 WHERE a.userMail = '${userMail}'`;

	conn.query(sql, (err, rows) => {
		if (!rows.length) {
			res.json({ status:'error', message:'No se encontró el correo!' });
			return;
		}

		if (err) {
			res.json({ status:'error', message:err.sqlMessage });
			return;
		}

		const hashPassword = rows[0].userPassword;
		const comparePassword = bcrypt.compareSync(userPassword, hashPassword);

		if (comparePassword) {
			const token = jwt.sign({ userKey:rows[0].userKey }, keyToken);

			res.json({
				status:'success',
				rows:{
					userKey:rows[0].userKey,
					userToken:token
				}
			});
		} else {
			res.json({ status:'error', message:'Contraseña incorrecta.' });
		}
	})
};

controller.singUp = (req, res) => {
	const { userName, userLastName, userMail, userPassword } = req.body;
	const userKey = nanoid.nanoid(9);
	const hashPassword = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(10));
	const sql = `CALL sp_registerUser('${userKey}', '${userName}', '${userLastName}', '${userMail}', '${hashPassword}')`;

	conn.query(sql, (err, rows) => {
		if (!err) {
			const token = jwt.sign({ userKey:rows[0].userKey }, keyToken);

			res.json({
				status:'success',
				rows:{
					userKey:rows[0][0].userKey,
					userToken:token
				}
			});
		} else {
			res.json({ status:'error', message:err.sqlMessage });
		}
	})
}


module.exports = controller;

