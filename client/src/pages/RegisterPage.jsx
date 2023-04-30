import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";

export default function RegisterPage() {
  const [names, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function getUser(e) {
    //We use this so that the page doesn't load onSubmit
    e.preventDefault();
    try {
      await axios.post("/register", {
        names,
        email,
        password,
      });
      alert("Registration Successful");
      setRedirect(true);
    } catch (e) {
      alert("Registration Failed");
    }
    // setName('')
    // setEmail('');
    // setPassword('');
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center">
      <div className="mb-64">
        <h1 className="text-2xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={getUser}>
          <input
            type="text"
            placeholder="Full Name"
            value={names}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary-btn">Register</button>
          <div className="mt-2 text-gray-500 text-center">
            Already have an account
            <Link
              className="underline text-black px-1"
              to="/Login"
              element={<LoginPage />}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
