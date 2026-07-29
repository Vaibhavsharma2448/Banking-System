import { useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async () => {
    try {
      const response = await api.post(
  "/auth/register",
  {
    name,
    email,
    password,
  }
);

     toast.success(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error( 
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={registerHandler}>
        Register
      </button>
    </div>
  );
}

export default Register;