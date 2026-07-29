import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

import { api } from "../services/api";
import Analytics from "../components/Analytics";

function Dashboard() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);

  const [amount, setAmount] = useState("");

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [receiverEmail, setReceiverEmail] =
    useState("");

  const [transferAmount, setTransferAmount] =
    useState("");

  const [transactions, setTransactions] =
    useState([]);

  const [summary, setSummary] = useState({
    deposit: 0,
    withdraw: 0,
    transfer: 0,
  });

  const logoutHandler = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

useEffect(() => {
  fetchBalance();
  fetchTransactions();
}, []);

const fetchBalance = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(
      "/bank/balance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBalance(res.data.balance);
  } catch (error) {
    console.log(error);
  }
};

const fetchTransactions = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(
      "/bank/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const list = res.data.transactions;

    setTransactions(list);

    let deposit = 0;
    let withdraw = 0;
    let transfer = 0;

    list.forEach((item) => {
      if (item.type === "deposit")
        deposit += item.amount;

      if (item.type === "withdraw")
        withdraw += item.amount;

      if (item.type === "transfer")
        transfer += item.amount;
    });

    setSummary({
      deposit,
      withdraw,
      transfer,
    });
  } catch (error) {
    console.log(error);
  }
};

const depositHandler = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/bank/deposit",
      {
        amount: Number(amount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Deposit Successful");

    setBalance(res.data.balance);

    setAmount("");

    fetchTransactions();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Deposit Failed"
    );
  }
};

const withdrawHandler = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/bank/withdraw",
      {
        amount: Number(withdrawAmount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Withdraw Successful");

    setBalance(res.data.balance);
    setWithdrawAmount("");

    fetchTransactions();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Withdraw Failed"
    );
  }
};

const transferHandler = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/bank/transfer",
      {
        receiverEmail,
        amount: Number(transferAmount),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   toast.success("Transfer Successful");

    setBalance(res.data.senderBalance);

    setReceiverEmail("");
    setTransferAmount("");

    fetchTransactions();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Transfer Failed"
    );
  }
};

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Bank Statement", 70, 20);

  doc.setFontSize(12);

  doc.text(
    `Current Balance : ₹${balance}`,
    14,
    35
  );

  const tableData = transactions.map(
    (item) => [
      item.type,
      `₹${item.amount}`,
      item.createdAt
        ? new Date(
            item.createdAt
          ).toLocaleString()
        : "N/A",
    ]
  );

  autoTable(doc, {
    startY: 45,
    head: [["Type", "Amount", "Date"]],
    body: tableData,
  });

  doc.save("Bank-Statement.pdf");
};

return (
  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Banking Dashboard
          </h1>

          <p className="text-gray-500">
            Welcome Back 👋
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            My Profile
          </button>

          <button
            onClick={logoutHandler}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg p-8 mb-6">

  <p className="text-lg">
    Current Balance
  </p>

  <h1 className="text-5xl font-bold mt-2">
    ₹{balance}
  </h1>

  <p className="opacity-80 mt-3">
    Available Balance
  </p>

</div>
<div className="grid md:grid-cols-3 gap-6 mb-6">

  {/* Deposit */}
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-xl font-bold mb-4">Deposit</h2>

    <input
      type="number"
      placeholder="Enter Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="border w-full p-3 rounded-lg mb-4"
    />

    <button
      onClick={depositHandler}
      className="bg-green-500 w-full text-white p-3 rounded-lg"
    >
      Deposit
    </button>
  </div>

  {/* Withdraw */}
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-xl font-bold mb-4">Withdraw</h2>

    <input
      type="number"
      placeholder="Enter Amount"
      value={withdrawAmount}
      onChange={(e) => setWithdrawAmount(e.target.value)}
      className="border w-full p-3 rounded-lg mb-4"
    />

    <button
      onClick={withdrawHandler}
      className="bg-red-500 w-full text-white p-3 rounded-lg"
    >
      Withdraw
    </button>
  </div>

  {/* Transfer */}
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-xl font-bold mb-4">Transfer</h2>

    <input
      type="email"
      placeholder="Receiver Email"
      value={receiverEmail}
      onChange={(e) => setReceiverEmail(e.target.value)}
      className="border w-full p-3 rounded-lg mb-4"
    />

    <input
      type="number"
      placeholder="Amount"
      value={transferAmount}
      onChange={(e) => setTransferAmount(e.target.value)}
      className="border w-full p-3 rounded-lg mb-4"
    />

    <button
      onClick={transferHandler}
      className="bg-blue-500 w-full text-white p-3 rounded-lg"
    >
      Transfer
    </button>
  </div>

</div>

<div className="grid md:grid-cols-4 gap-5 mb-6">

  <div className="bg-green-500 text-white rounded-xl p-5">
    <h3>Total Deposit</h3>
    <h1 className="text-3xl font-bold">
      ₹{summary.deposit}
    </h1>
  </div>

  <div className="bg-red-500 text-white rounded-xl p-5">
    <h3>Total Withdraw</h3>
    <h1 className="text-3xl font-bold">
      ₹{summary.withdraw}
    </h1>
  </div>

  <div className="bg-blue-500 text-white rounded-xl p-5">
    <h3>Total Transfer</h3>
    <h1 className="text-3xl font-bold">
      ₹{summary.transfer}
    </h1>
  </div>

  <div className="bg-purple-600 text-white rounded-xl p-5">
    <h3>Total Transactions</h3>
    <h1 className="text-3xl font-bold">
      {transactions.length}
    </h1>
  </div>

</div>
<Analytics transactions={transactions} />

<div className="my-6">
  <button
    onClick={downloadPDF}
    className="bg-purple-600 text-white px-6 py-3 rounded-lg"
  >
    Download Bank Statement
  </button>
</div>

<div className="bg-white rounded-2xl shadow p-6 mb-6">

  <h2 className="text-2xl font-bold mb-5">
    Recent Transactions
  </h2>

  {transactions.slice(0, 5).map((item) => (
    <div
      key={item._id}
      className="flex justify-between border-b py-3"
    >
      <div>
        <h3 className="capitalize font-semibold">
          {item.type}
        </h3>

        <p className="text-gray-500 text-sm">
          {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>

      <h3 className="font-bold">
        ₹{item.amount}
      </h3>
    </div>
  ))}

</div>

<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-2xl font-bold mb-4">
    Transaction History
  </h2>

  {transactions.length === 0 ? (
    <p>No Transactions Found</p>
  ) : (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-3">Type</th>
          <th className="border p-3">Amount</th>
          <th className="border p-3">Date</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((item) => (
          <tr key={item._id}>
            <td className="border p-3 capitalize">
              {item.type}
            </td>

            <td className="border p-3">
              ₹{item.amount}
            </td>

            <td className="border p-3">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  </div>
);
}

export default Dashboard;
