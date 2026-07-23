const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: Number,
      default: () =>
        Math.floor(
          1000000000 + Math.random() * 9000000000
        ),
    },

    balance: {
      type: Number,
      default: 0,
    },
    accountNumber: {
  type: String,
  unique: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);