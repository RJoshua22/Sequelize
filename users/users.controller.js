const express = require('express'); 
const router = express.Router(); 
const Joi = require('joi'); 
const validateRequest = require('_middleware/validate-request'); 
const Role = require('_helpers/role'); 
const userService = require('./user.service');

router.get('/', getAll); 
// router.get('/:id', getById); 
router.post('/', createSchema, create); 
// router.put('/:id', updateSchema, update); 
// router.delete('/:id', _delete); 

module.exports = router;

function getAll(req, res, next){
    userService.getAll()
        .then(users => res.json(users))
        .catch(next)
}

function create(req, res, next){
    userService.create(req.body)
        .then(() => res.json({message : 'User created'}))
        .catch(next);
}

function createSchema(req, res, next){
    const schema = Joi.object({
        title : Joi.string().required(),
        firstName : Joi.string().required(),
        lastName : Joi.string().required(),
        role : Joi.string().valid(Role.Admin, Role.User).required(),
        email : Joi.string().required(),
        password : Joi.string().min(6).required(),
        confirmPassword : Joi.string().valid(Joi.ref('password')).required()
    });

    validateRequest(req, next, schema);
}

function updateSchema(req, res, next){
    const schema = Joi.object({
        title : Joi.string().empty(''),
        firstName : Joi.string().empty(''),
        lastName : Joi.string().empty(''),
        role : Joi.string().valid(Role.Admin, Role.User).empty(''),
        email : Joi.string().empty(''),
        password : Joi.string().min(6).empty(''),
        confirmPassword : Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

