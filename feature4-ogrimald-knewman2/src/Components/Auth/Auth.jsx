import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Parse from "parse";

const AuthModule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function resetAuthState() {
      try {
        await Parse.User.logOut(); // Logs out any existing user
      } catch (error) {
        console.error("Error logging out user:", error);
      }
    }

    resetAuthState();
  }, []);

  return (
    <div>
      <Link to="/auth/register">
        <button>Register</button>
      </Link>
      <br />
      <br />
      <Link to="/auth/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default AuthModule;