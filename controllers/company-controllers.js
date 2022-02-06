const { companyModel } = require('../db/schemas/company-schema');

class CompanyControllers {
  /*
Shows all companies and submits the list of companies to the front.
The lean() method method is necessary to pass data from mongo to the hbs view.
 */
  async allCompanies(req, res) {
    try {
      const companies = await companyModel.find().lean();
      res.render('companies/all', { companies });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Data not avaible' });
    }
  }

  /*
Rendering a view with add formular
 */
  addCompanyFormular(req, res) {
    res.render('companies/addCompany');
  }

  /*
    Create new company with values from add formular.
    If error, render a error page view with the provided information.
     */
  async addCompany(req, res) {
    const newCompany = new companyModel({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      assignedPerson: req.body.assignedPerson,
      notes: req.body.notes,
      contactPerson: req.body.contactPerson,
      addedBy: req.session.user,

    });

    try {
      await newCompany.save();
      res.redirect('/admin/all');
    } catch (err) {
      res.render('others/error', { error: 'The required data was not provided' });
      console.log(err);
    }
  }

  /*
    Show one company.
    lastEdit gets the last item form "lastEdit" array. This table records information about each edit made on the company profile.
     */
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const company = await companyModel.findById(id).lean();
      const lastEdit = company.lastEdit[company.lastEdit.length - 1];
      res.render('companies/getOne', { company, lastEdit });
    } catch (err) {
      res.render('others/error', { error: 'Company with the given id address does not exist.' });
    }
  }

  /*
Find and delete a company.
     */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await companyModel.findByIdAndDelete(id);
      res.render('others/info', { message: 'Company has been deleted' });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexpected error. Please try again.' });
    }
  }

  /*
Confirm delete
 */
  async confirmDelete(req, res) {
    const { id } = req.params;
    try {
      const company = await companyModel.findById(id).lean();
      res.render('companies/delete', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexpected error. Please try again.' });
    }
  }

  /*
shows edition formular
 */
  async editFormular(req, res) {
    const { id } = req.params;
    try {
      const company = await companyModel.findById(id).lean();
      res.render('companies/edit', { company });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Company with the given id address does not exist' });
    }
  }

  /*
    Save changes in company's profile/
    newEdit contains information about the user who edited, date and description of changes
     */
  async edit(req, res) {
    const newEdit = {
      name: req.session.user,
      date: new Date().toLocaleString('pl', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      editDescription: req.body.editDescription,
    };
    try {
      const { id } = req.params;
      const company = await companyModel.findById(id);
      company.name = req.body.name;
      company.address = req.body.address;
      company.email = req.body.email;
      company.phone = req.body.phone;
      company.assignedPerson = req.body.assignedPerson;
      company.notes = req.body.notes;
      company.contactPerson = req.body.contactPerson;
      company.addedBy = req.body.addedBy;
      company.lastEdit.push(newEdit);
      company.save();
      res.redirect(`/admin/get/${id}`);
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Unexpected error. Please try again.' });
    }
  }

  /*
Show editing history
 */
  async history(req, res) {
    const { id } = req.params;
    try {
      const company = await companyModel.findById(id);
      const { name } = company;
      const history = company.lastEdit;
      res.render('companies/history', { history, name, id });
    } catch (err) {
      console.log(err);
      res.render('others/error', { error: 'Company with the given id address does not exist' });
    }
  }
}

module.exports = new CompanyControllers();
