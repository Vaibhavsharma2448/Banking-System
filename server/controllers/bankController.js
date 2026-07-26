const User = require("../models/user");
const Transaction = require("../models/Transaction");

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(
      req.user.id
    );

    user.balance += Number(amount);

    await user.save();

    await Transaction.create({
      user: user._id,
      type: "deposit",
      amount,
    });

    res.json({
      success: true,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
      });
    }

    user.balance -= Number(amount);

    await user.save();

    await Transaction.create({
      user: user._id,
      type: "withdraw",
      amount,
    });

    res.json({
      success: true,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.transfer = async (req, res) => {
  try {
    const {
  receiverEmail,
  amount,
} = req.body;

    const sender = await User.findById(req.user.id);

    const receiver =
  await User.findOne({
    email: receiverEmail,
  });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
      });
    }

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    await Transaction.create({
      user: sender._id,
      receiver: receiver._id,
      type: "transfer",
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Transfer Successful",
      senderBalance: sender.balance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSummary = async (req, res) => {
  try {
    // User find karo
    const user = await User.findById(req.user.id);

    // User ki saari transactions lao
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    // Income aur Expense calculate karo
    transactions.forEach((item) => {
      if (item.type === "deposit") {
        totalIncome += item.amount;
      }

      if (item.type === "withdraw") {
        totalExpense += item.amount;
      }
    });

    // Response bhejo
    res.status(200).json({
      success: true,
      balance: user.balance,
      income: totalIncome,
      expense: totalExpense,
      transactions: transactions.length,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};