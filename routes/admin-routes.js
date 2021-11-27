const express = require('express')
const AdminRouter = express.Router()
const companyControllers = require('../controllers/company-controllers')
const transactionsControllers = require('../controllers/transactions-controllers')


/*
Routing on companies operations
 */
AdminRouter.get('/add',companyControllers.addCompanyFormular) // add company - formular
AdminRouter.post('/addCompany', companyControllers.addCompany) // add company
AdminRouter.get('/all',companyControllers.allCompanies) // get all companies
AdminRouter.get('/get/:id', companyControllers.getOne) // get one company
AdminRouter.get('/delete/:id', companyControllers.delete) // delete company
AdminRouter.get('/delete/confirm/:id', companyControllers.confirmDelete) //delete confirm
AdminRouter.get('/edit/:id', companyControllers.editFormular) // edit company - formular
AdminRouter.post('/edit/:id', companyControllers.edit) // edit company
AdminRouter.get('/history/:id', companyControllers.history) // show edit history

/*
Routing on transactions operations
 */
AdminRouter.get('/get/:id/transactions', transactionsControllers.showTransactions) // show all transactions from one company
AdminRouter.get('/get/:id/transactions/add', transactionsControllers.addTransactionForm) // add transaction - formular
AdminRouter.post('/get/:id/transactions/add', transactionsControllers.addTransaction) // add transaction
AdminRouter.get('/get/:id/transactions/:transactionId', transactionsControllers.getOneTransaction) // get one transaction
AdminRouter.get('/get/:id/transactions/delete/:transactionId', transactionsControllers.deleteTransaction) // delete one transaction



module.exports = {
    AdminRouter
}