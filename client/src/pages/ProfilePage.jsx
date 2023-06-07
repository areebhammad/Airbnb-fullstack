import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import LoginPage from "./LoginPage";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { user, ready, setUser } = useContext(UserContext);
  const { subpage } = useParams();

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {(subpage === "profile" || subpage === undefined) && (
        <div className="text-center max-w-sm mx-auto mt-16">
          Name: {user.names} <br />
          Email: {user.email} <br />
          <button onClick={logout} className="primary-btn max-w-sm mt-4">
            Logout
          </button>{" "}
          <br />
        </div>
      )}

      {subpage === "bookings" && <div></div>}

      {subpage === "places" && (
        <div>
          <PlacesPage />
        </div>
      )}
    </div>
  );
}
