import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Analytics({ transactions }) {
  let deposit = 0;
  let withdraw = 0;
  let transfer = 0;

  transactions.forEach((item) => {
    const amount = Number(item.amount) || 0;

    if (item.type === "deposit") {
      deposit += amount;
    }

    if (item.type === "withdraw") {
      withdraw += amount;
    }

    if (item.type === "transfer") {
      transfer += amount;
    }
  });

  const totalActivity =
    deposit + withdraw + transfer;

  const pieData = {
    labels: [
      "Deposit",
      "Withdraw",
      "Transfer",
    ],
    datasets: [
      {
        data: [
          deposit,
          withdraw,
          transfer,
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: [
      "Deposit",
      "Withdraw",
      "Transfer",
    ],
    datasets: [
      {
        label: "Amount",
        data: [
          deposit,
          withdraw,
          transfer,
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ₹${context.raw}`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ₹${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">

      <h2 className="text-2xl font-bold mb-6">
        Banking Analytics
      </h2>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
          <p className="text-gray-500">
            Total Deposit
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            ₹{deposit}
          </h3>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <p className="text-gray-500">
            Total Withdraw
          </p>

          <h3 className="text-2xl font-bold text-red-600">
            ₹{withdraw}
          </h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-gray-500">
            Total Transfer
          </p>

          <h3 className="text-2xl font-bold text-blue-600">
            ₹{transfer}
          </h3>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
          <p className="text-gray-500">
            Total Activity
          </p>

          <h3 className="text-2xl font-bold text-purple-600">
            ₹{totalActivity}
          </h3>
        </div>

      </div>

      {/* Charts */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* Pie Chart */}

        <div className="border rounded-2xl p-5">

          <h3 className="text-lg font-semibold mb-4">
            Transaction Distribution
          </h3>

          <div className="h-[320px]">
            {totalActivity > 0 ? (
              <Pie
                data={pieData}
                options={pieOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No transaction data available
              </div>
            )}
          </div>

        </div>

        {/* Bar Chart */}

        <div className="border rounded-2xl p-5">

          <h3 className="text-lg font-semibold mb-4">
            Transaction Comparison
          </h3>

          <div className="h-[320px]">
            {totalActivity > 0 ? (
              <Bar
                data={barData}
                options={barOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No transaction data available
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;