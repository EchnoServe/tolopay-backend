const schedule = require("node-schedule");

const { transfer } = require("./controllers/transactionController");
const RecurrentTransaction = require("./models/recurrenttransaction");
const User = require("./models/user");
const Notification = require("./models/notification");

//a simple node scheduleJob within seconds to find if there any active recurrentTransactions
//and done automatic recurrentTransactions  for each

const job = schedule.scheduleJob("* * * * * *", async function () {
  try {
    const recurrentTransactions = await RecurrentTransaction.find({
      active: true,
      date: { $lte: Date.now() },
    });

    console.log(recurrentTransactions);

    for await (const recurrentTransaction of recurrentTransactions) {
      const {
        amount,
        account_number_from,
        account_number_to,
        remark,
        recurrent,
      } = recurrentTransaction;
      const user = await User.findById(account_number_from);
      await transfer(
        {
          phoneNumber: account_number_to,
          amount: amount,
          remark: remark,
          user: user,
        },
        true
      );
      await Notification.create({
        message: `Your Date payment for ${remark} to is account ${account_number_to} is Done!!!`,
        user: account_number_from,
      });

      //:Update next time
      await RecurrentTransaction.create({
        date: Date.now() + recurrent * 60 * 1000, //simple recurring transaction  with a minute
        recurrent,
        amount,
        account_number_from,
        account_number_to,
        remark,
      });
      recurrentTransaction.active = false;

      await recurrentTransaction.save();
    }
  } catch (ex) {
    console.log(ex.message);
  }
});

module.exports = job;
