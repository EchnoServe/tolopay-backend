const RecurrentTransaction = require("./../models/recurrenttransaction");

exports.getRecurrentTransaction = async (req, res, next) => {
  const recurrent = await RecurrentTransaction.find({ user: req.user.id });

  res.status(201).json({
    status: "OK",
    data: {
      recurrent,
    },
  });
};

exports.addRecurrentTransaction = async (req, res, next) => {
  const { date, amount, account_number_to, remark } = req.body;

  const recurrent = await RecurrentTransaction.create({
    date: Date.now() + date * 60 * 1000, //simple recurring transaction  with a minute
    recurrent: date,
    amount,
    account_number_from: req.user.id,
    account_number_to,
    remark,
  });

  res.status(201).json({
    status: "OK",
    data: {
      recurrent,
    },
  });
};
