const model = require("../models/model");

// post: http://localhost:8080/api/categories
async function create_Categories(req, res) {
  const Create = new model.Categories({
    type: "Investment",
    color: "#FCBE44",
  });

  await Create.save(function (err) {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: "Error while creating categories ${err}" });
  });
}

//  get: http://localhost:8080/api/categories
async function get_Categories(req, res) {
  let data = await model.Categories.find({});

  let filter = await data.map((v) =>
    Object.assign({}, { type: v.type, color: v.color })
  );
  return res.json(filter);
}

//  post: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
  if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
  let { name, type, amount, userEmail } = req.body;

  const create = await new model.Transaction({
    name,
    type,
    amount,
    date: new Date(),
    userEmail,
  });

  create.save(function (err) {
    if (!err) return res.json(create);
    return res
      .status(400)
      .json({ message: `Erro while creating transaction ${err}` });
  });
}

//  get: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
  let data = await model.Transaction.find();
  return res.json(data);
}

//  delete: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
  if (!req.body) res.status(400).json({ message: "Request body not Found" });

  await model.Transaction.deleteOne(req.body, function (err) {
    if (!err) res.json("Record Deleted");
  })
    .clone()
    .catch(function (err) {
      res.json("Error occured while deleting Transaction Record");
    });
}

//  get: http://localhost:8080/api/labels
async function get_Labels(req, res) {
  // call array, pass an Object, inside Object, specify collections that we want to join
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      let data = result.map((v) =>
        Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
            userEmail: v.userEmail,
            date: v.date
          }
        )
      );

      res.json(data);
    })
    .catch((error) => {
      res.status(400).json("Lookup Collection Error");
    });
}

//  get: http://localhost:8080/api/users
async function get_User(req, res) {
  model.User.findOne({ userEmail: req.body.userEmail }, function (err, user) {
    if (user == null || !user.validPassword(req.body.password)) {
      res.json({ userEmail: "" });
    } else {
      res.json({ userEmail: req.body.userEmail });
    }
  });
}

//  post: http://localhost:8080/api/users
async function create_User(req, res) {
  if (req.body.userEmail == undefined || req.body.password == undefined) {
    return res.status(400).json({ message: `Error while creating user` });
  }
  let data = await model.User.findOne({ userEmail: req.body.userEmail });
  if (data != null) {
    res.json({ userEmail: "" });
  } else {
    var new_user = new model.User({
      userEmail: req.body.userEmail,
    });
    new_user.password = new_user.generateHash(req.body.password);
    new_user.save(function (err) {
      if (!err) return res.json({ userEmail: req.body.userEmail });
      return res
        .status(400)
        .json({ message: `Error while creating user ${err}` });
    });
  }
}

module.exports = {
  create_Categories,
  get_Categories,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels,
  get_User,
  create_User,
};
