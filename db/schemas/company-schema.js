const mongoose = require('mongoose');
const { validateEmail } = require('../../utils/validateEmail');

const { Schema } = mongoose;

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validateEmail, 'Invalid Email'],
  },
  phone: {
    type: Number,
  },
  assignedPerson: {
    type: String,
    trim: true,
  },
  notes: {
    type: Object,
  },
  contactPerson: {
    type: String,
  },
  addedBy: {
    type: String,
  },
  created: {
    type: String,
    default: new Date().toLocaleString('pl', {
      dateStyle: 'short',
      timeStyle: 'short',
    }),
  },
  transactions: {
    type: [Object],
  },
  lastEdit: {
    type: [Object],
  },
});

const companyModel = mongoose.model('companyModel', CompanySchema, 'companies');
module.exports = {
  companyModel,
};
