import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import RegisterPage from "./RegisterPage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      const userInfo = await axios.post("/login", { email, password });
      setUser(userInfo.data);
      //or
      // const {userInfo} = await axios.post('/login', {email, password});
      // setUser(userInfo);
      // alert("login Succesful");
      setRedirect(true);
    } catch (e) {
      alert("error");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center">
      <div className="mb-64">
        <h1 className="text-2xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
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
          <button className="primary-btn">Login</button>
          <div className="mt-2 text-gray-500 text-center">
            Don't have an account yet?
            <Link
              className="underline text-black px-1"
              to="/register"
              element={<RegisterPage />}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
