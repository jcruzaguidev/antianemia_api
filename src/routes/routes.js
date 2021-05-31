const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { keyToken } = require('../keys');

const loginUserController = require('../controllers/loginUserController');


router.post('/signin', loginUserController.signIn);
router.post('/signup', loginUserController.singUp);


module.exports = router;


function verifyToken(req, res, next) {
	if (!req.headers.authorization) return res.status(401).send({
		status:'error',
		message:'Unauthorized request'
	});

	const token = req.headers.authorization.split(' ')[1];
	if (token === 'null') return res.status(401).send({
		status:'error',
		message:'Token authorized required'
	});

	const payload = jwt.verify(token, keyToken);
	req.userKey = payload.userKey;
	next();
}
