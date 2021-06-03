const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { keyToken } = require('../keys');

const loginAdminController = require('../controllers/loginAdminController');
const loginUserController = require('../controllers/loginUserController');
const recipesAdminController = require('../controllers/recipesController');
const regionAdminController = require('../controllers/regionController');
const ingredientsController = require('../controllers/ingredientsController');
const stepsController = require('../controllers/stepsCook');

/** SERVICIOS ADMINISTRADOR **/
router.post('/admin/signin', loginAdminController.signIn);
router.post('/admin/signup', loginAdminController.singUp);

router.get('/admin/recipes/:type', verifyToken, recipesAdminController.getRecipe);
router.post('/admin/recipes', verifyToken, recipesAdminController.insertRecipe);
router.put('/admin/recipes', verifyToken, recipesAdminController.updateRecipe);
router.put('/admin/status/recipes', verifyToken, recipesAdminController.updateStatusRecipe);

router.get('/admin/region/:type', verifyToken, regionAdminController.getRegion);
router.post('/admin/region', verifyToken, regionAdminController.insertRegion);
router.put('/admin/region', verifyToken, regionAdminController.updateRegion);
router.put('/admin/status/region', verifyToken, regionAdminController.updateStatusRegion);

router.get('/admin/ingredients/:recipesKey', verifyToken, ingredientsController.getIngredients);
router.post('/admin/ingredients', verifyToken, ingredientsController.insertIngredients);
router.delete('/admin/ingredients', verifyToken, ingredientsController.deleteIngredients);

router.get('/admin/steps/:recipesKey', verifyToken, stepsController.getStepsCook);
router.post('/admin/steps', verifyToken, stepsController.insertStepsCook);
router.delete('/admin/steps', verifyToken, stepsController.deleteStepsCook);

/** SERVICIOS USUARIOS **/
router.post('/signin', loginUserController.signIn);
router.post('/signup', loginUserController.singUp);

module.exports = router;

function verifyToken(req, res, next) {
	if (!req.headers.authorization) return res.status(401).send({
		status:'error',
		message:'No cuenta con autorización para la petición'
	});

	const token = req.headers.authorization.split(' ')[1];
	if (token === 'null') return res.status(401).send({
		status:'error',
		message:'Se requiere token de autorización'
	});

	const payload = jwt.verify(token, keyToken);
	req.userKey = payload.userKey;
	next();
}
