const Joi = require('joi');

exports.customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  totalSpend: Joi.number().optional(),
  visits: Joi.number().integer().optional(),
  lastActive: Joi.date().optional(),
  messages: Joi.array().items(Joi.string()).default([])
});

exports.orderSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  date: Joi.date().required(),
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});
