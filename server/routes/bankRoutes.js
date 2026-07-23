const express = require("express");
const router = express.Router();

const {
  deposit,
  withdraw,
  getBalance,
  transfer,
  getTransactions,
} = require("../controllers/bankController");

const {
  auth,
} = require("../middlewares/auth");

router.post(
  "/deposit",
  auth,
  deposit
);
router.get(
  "/transactions",
  auth,
  getTransactions
);
router.post("/deposit", auth, deposit);
router.post("/withdraw", auth, withdraw);
router.get("/balance", auth, getBalance);
router.post("/transfer", auth, transfer);

module.exports = router;