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

return(
  <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Secure Banking
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Banking Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Welcome back 👋
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            My Profile
          </button>

          <button
            onClick={logoutHandler}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
        <p className="text-blue-100 text-sm font-medium">
          Current Balance
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mt-2">
          ₹{balance}
        </h2>

        <div className="flex items-center gap-2 mt-4 text-sm text-blue-100">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
          Available Balance
        </div>
      </div>

      {/* Banking Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Deposit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Deposit
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add money to your account
            </p>
          </div>

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-slate-300 w-full p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />

          <button
            onClick={depositHandler}
            className="bg-green-500 hover:bg-green-600 w-full text-white p-3 rounded-xl font-medium transition"
          >
            Deposit Money
          </button>
        </div>

        {/* Withdraw */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Withdraw
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Withdraw money from your account
            </p>
          </div>

          <input
            type="number"
            placeholder="Enter Amount"
            value={withdrawAmount}
            onChange={(e) =>
              setWithdrawAmount(e.target.value)
            }
            className="border border-slate-300 w-full p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
          />

          <button
            onClick={withdrawHandler}
            className="bg-red-500 hover:bg-red-600 w-full text-white p-3 rounded-xl font-medium transition"
          >
            Withdraw Money
          </button>
        </div>

        {/* Transfer */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Transfer
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Send money to another user
            </p>
          </div>

          <input
            type="email"
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) =>
              setReceiverEmail(e.target.value)
            }
            className="border border-slate-300 w-full p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />

          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) =>
              setTransferAmount(e.target.value)
            }
            className="border border-slate-300 w-full p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />

          <button
            onClick={transferHandler}
            className="bg-blue-600 hover:bg-blue-700 w-full text-white p-3 rounded-xl font-medium transition"
          >
            Transfer Money
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-green-500 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-green-100 text-sm">
            Total Deposit
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{summary.deposit}
          </h2>
        </div>

        <div className="bg-red-500 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-red-100 text-sm">
            Total Withdraw
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{summary.withdraw}
          </h2>
        </div>

        <div className="bg-blue-500 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-blue-100 text-sm">
            Total Transfer
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{summary.transfer}
          </h2>
        </div>

        <div className="bg-purple-600 text-white rounded-2xl p-5 shadow-sm">
          <p className="text-purple-100 text-sm">
            Total Transactions
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {transactions.length}
          </h2>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Analytics
        </h2>

        <p className="text-slate-500 text-sm mb-5">
          Overview of your banking activity
        </p>

        <Analytics transactions={transactions} />
      </div>

      {/* PDF Statement */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Bank Statement
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Download your transaction statement as PDF.
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Download Statement
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your latest banking activity
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">
              No recent transactions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"
              >
                <div>
                  <h3 className="capitalize font-semibold text-slate-900">
                    {item.type}
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <h3 className="font-bold text-slate-900">
                  ₹{item.amount}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Transaction History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Transaction History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Complete transaction records
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">
              No Transactions Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 text-left">
                    Type
                  </th>

                  <th className="border border-slate-200 p-3 text-left">
                    Amount
                  </th>

                  <th className="border border-slate-200 p-3 text-left">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="border border-slate-200 p-3 capitalize font-medium">
                      {item.type}
                    </td>

                    <td className="border border-slate-200 p-3 font-semibold">
                      ₹{item.amount}
                    </td>

                    <td className="border border-slate-200 p-3 text-slate-600">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </div>
 );
}
export default Dashboard;
