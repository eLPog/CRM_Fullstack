const { v4: uuid } = require('uuid'); // used to create a unique id number
const { transactionSum } = require('../utils/transactionSum');
const { companyModel } = require('../db/schemas/company-schema');

class transactionsControllers {
  /*
    shows all transactions
     */
  async showTransactions(req, res) {
    const { id } = req.params;
    try {
      const company = await companyModel.findById(id).lean();
      res.render('companies/transactions/showTransactions', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Database error. Please try again.' });
    }
  }

  /*
add transaction formular
 */
  async addTransactionForm(req, res) {
    const { id } = req.params;
    try {
      const company = await companyModel.findById(id).lean();
      res.render('companies/transactions/addTransactionForm', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexpected error.' });
    }
  }

  /*
add transaction
newTransaction includes, among others, unique id, transaction amount, description, data of the user making the entry.
If the date format is invalid, it renders the error view.
If the transaction description is empty, it adds information about the lack of description.
Next adds transactions to the company's transaction list.
I need to use lean() method on elements from mongoDB. This is necessary to pass the entire object to the hbs view.
 */
  async addTransaction(req, res) {
    const { id } = req.params;
    const newTransaction = {
      transactionId: uuid(),
      transactionType: req.body.transactionType,
      transactionName: req.body.transactionName,
      sum: transactionSum(req.body.sumEuro, req.body.sumCent),
      paymentMethod: req.body.paymentMethod,
      description: req.body.description,
      transactionDate: req.body.transactionDate,
      addedBy: req.session.user,
    };
    if (newTransaction.description.length <= 1) {
      newTransaction.description = 'Not reported';
    }
    if (newTransaction.transactionDate.length > 10) {
      res.render('others/error', { error: 'Invalid data format. Please try again.' });
    }
    try {
      let company = await companyModel.findById(id);
      await company.transactions.push(newTransaction);
      await company.save();
      company = await companyModel.findById(id).lean();
      res.render('companies/transactions/showTransactions', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexpected error. Please try again.' });
    }
  }

  /*
    Delete transaction
     */
  async deleteTransaction(req, res) {
    const { id, transactionId } = req.params;
    try {
      let company = await companyModel.findById(id);
      company.transactions = company.transactions.filter((el) => el.transactionId !== transactionId);
      await company.save();
      company = await companyModel.findById(id).lean();
      res.render('companies/transactions/showTransactions', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexptected error. Please try again.' });
    }
  }

  /*
Show one transaction.
First I am looking for a company for the id,
Then, in the transaction list, I look for the transaction by transaction id
 */
  async getOneTransaction(req, res) {
    const { id, transactionId } = req.params;
    try {
      const company = await companyModel.findById(id).lean();
      const transaction = company.transactions.find((el) => el.transactionId === transactionId);
      res.render('companies/transactions/transactionDetails', { company, transaction });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new transactionsControllers();
