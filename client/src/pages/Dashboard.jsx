import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
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
    const navigate = useNavigate();

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

    const response = await axios.get(
      `${API}/bank/balance`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBalance(response.data.balance);
  } catch (error) {
    console.log(error);
  }
};

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
  `${API}/bank/transactions`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setTransactions(
        response.data.transactions
      );
    } catch (error) {
      console.log(error);
    }
  };

  const depositHandler = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.post(
  `${API}/bank/deposit`,
  {
    amount: Number(amount),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Deposit Successful");

      setBalance(response.data.balance);
      setAmount("");
      fetchTransactions();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Deposit Failed"
      );
    }
  };

  const withdrawHandler = async () => {
    try {
      const response = await axios.post(
  `${API}/bank/withdraw`,
  {
    amount: Number(withdrawAmount),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Withdraw Successful");

      setBalance(response.data.balance);
      setWithdrawAmount("");
      fetchTransactions();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Withdraw Failed"
      );
    }
  };

  const transferHandler = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.post(
  `${API}/bank/transfer`,
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

      alert("Transfer Successful");

      setBalance(
        response.data.senderBalance
      );

      setReceiverEmail("");
      setTransferAmount("");

      fetchTransactions();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Transfer Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold text-center mb-8">
  Banking Dashboard
</h1>

<button
  onClick={logoutHandler}
  className="bg-black text-white px-4 py-2 rounded-lg"
>
  Logout
</button> 

        {/* Balance */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-3xl font-bold">
            ₹{balance}
          </h2>
          <p>Current Balance</p>
        </div>

        {/* Deposit */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h3 className="text-xl font-bold mb-4">
            Deposit Money
          </h3>

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="border p-3 rounded-lg w-full mb-4"
          />

          <button
            onClick={depositHandler}
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
          >
            Deposit
          </button>
        </div>

        {/* Withdraw */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h3 className="text-xl font-bold mb-4">
            Withdraw Money
          </h3>

          <input
            type="number"
            placeholder="Enter Amount"
            value={withdrawAmount}
            onChange={(e) =>
              setWithdrawAmount(
                e.target.value
              )
            }
            className="border p-3 rounded-lg w-full mb-4"
          />

          <button
            onClick={withdrawHandler}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Withdraw
          </button>
        </div>

        {/* Transfer */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h3 className="text-xl font-bold mb-4">
            Transfer Money
          </h3>

          <input
            type="email"
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) =>
              setReceiverEmail(
                e.target.value
              )
            }
            className="border p-3 rounded-lg w-full mb-4"
          />

          <input
            type="number"
            placeholder="Enter Amount"
            value={transferAmount}
            onChange={(e) =>
              setTransferAmount(
                e.target.value
              )
            }
            className="border p-3 rounded-lg w-full mb-4"
          />

          <button
            onClick={transferHandler}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Transfer
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-bold mb-4">
            Transaction History
          </h3>

          {transactions.length === 0 ? (
  <p>No Transactions Found</p>
) : (
  <table className="w-full border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-3">
          Type
        </th>

        <th className="border p-3">
          Amount
        </th>

        <th className="border p-3">
          Date
        </th>
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
              ? new Date(
                  item.createdAt
                ).toLocaleString()
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