import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Analytics({ transactions }) {
  let deposit = 0;
  let withdraw = 0;
  let transfer = 0;

  transactions.forEach((item) => {
    if (item.type === "deposit")
      deposit += item.amount;

    if (item.type === "withdraw")
      withdraw += item.amount;

    if (item.type === "transfer")
      transfer += item.amount;
  });

  const data = {
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
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Banking Analytics
      </h2>

      <Pie data={data} />
    </div>
  );
}

export default Analytics;