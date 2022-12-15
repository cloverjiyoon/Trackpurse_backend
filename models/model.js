const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

// categories => field => ['type', 'color']
const categories_model = new Schema({
  type: { type: String, default: "Investment" },
  color: { type: String, default: "#FCBE44" },
});

// transactions  => field => ['name', 'type', 'amount', 'date', 'userEmail]
const transaction_model = new Schema({
  name: { type: String, default: "Anonymous" },
  type: { type: String, default: "Investment" },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
  userEmail: { type: String },
});

// users  => field => ['userEmail', 'password']
const user_model = new Schema(
  {
    userEmail: { type: String },
    password: { type: String },
  },
  {
    methods: {
      generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      validPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  }
);

// mongoose models for Categories and Transaction
const Categories = mongoose.model("categories", categories_model);
const Transaction = mongoose.model("transaction", transaction_model);
const User = mongoose.model("user", user_model);

exports.default = Transaction;
module.exports = {
  Categories,
  Transaction,
  User,
};
