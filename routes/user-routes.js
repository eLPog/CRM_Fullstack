const express = require('express');

const UserRouter = express.Router();
const userControllers = require('../controllers/user-controllers');

/*
Routing on user operations
 */
UserRouter.get('/registration', userControllers.showRegistrationPage); // registration from
UserRouter.post('/registration', userControllers.registration); // registration
UserRouter.get('/login', userControllers.showLoginPage); // login form
UserRouter.post('/login', userControllers.login); // login
UserRouter.get('/logout', userControllers.logout); // logout
UserRouter.get('/admin/profile', userControllers.showProfile); // user profile
UserRouter.get('/admin/profile/:id', userControllers.showEditProfile); // profile edit form
UserRouter.post('/admin/profile/:id', userControllers.editProfile); // profile edit
UserRouter.get('/admin/profile/password/:id', userControllers.showPasswordPage); // password change form
UserRouter.post('/admin/profile/password/:id', userControllers.changePassword); // password change
UserRouter.get('/admin/profile/delete/:id', userControllers.deleteUser); // account delete
UserRouter.get('/admin/profile/deleteConfirm/:id', userControllers.deleteConfirm); // confirm account delete
UserRouter.get('/admin/profile/password/reset/:id', userControllers.resetPassword); // user password reset

module.exports = { UserRouter };
