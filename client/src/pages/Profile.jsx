import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PROFILE RESPONSE:", response.data);

setUser(response.data.user);

      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Profile
        </h1>

        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Account Number:</strong> {user.accountNumber}
          </p>

          <p>
            <strong>Balance:</strong> ₹{user.balance}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;