import { useEffect, useState } from "react";
import { api } from "../services/api";
import Deposit from "../components/Deposit";

function Dashboard() {
  const [balance, setBalance] =
    useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await api.get(
          "/bank/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setBalance(
        response.data.balance
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>
        Balance : ₹{balance}
      </h2>

      <Deposit />
    </div>
  );
}

export default Dashboard;