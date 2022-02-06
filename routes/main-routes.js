const express = require('express');

const MainRouter = express.Router();
const mainControllers = require('../controllers/main-controllers');

/*
Routing on main page
 */
MainRouter.get('/', mainControllers.showHomePage);

module.exports = {
  MainRouter,
};
