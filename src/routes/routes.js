const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { keyToken } = require('../keys');

const loginAdminController = require('../controllers/loginAdminController');
const loginUserController = require('../controllers/loginUserController');
const recipesAdminController = require('../controllers/recipesController');
const regionAdminController = require('../controllers/regionController');

router.post('/admin/signin', loginAdminController.signIn);
router.post('/admin/signup', loginAdminController.singUp);

router.post('/signin', loginUserController.signIn);
router.post('/signup', loginUserController.singUp);

router.get('/admin/recipes/:type', recipesAdminController.getRecipe);
router.post('/admin/recipes', recipesAdminController.insertRecipe);
router.put('/admin/recipes', recipesAdminController.updateRecipe);
router.put('/admin/status/recipes', recipesAdminController.updateStatusRecipe);

router.get('/admin/region/:type', regionAdminController.getRegion);
router.post('/admin/region', regionAdminController.insertRegion);
router.put('/admin/region', regionAdminController.updateRegion);
router.put('/admin/status/region', regionAdminController.updateStatusRegion);

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
