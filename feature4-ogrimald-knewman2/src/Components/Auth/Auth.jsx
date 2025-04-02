import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { checkUser } from "./AuthService";

const AuthModule = () => {
  const navigate = useNavigate();

  // redirect already authenticated users back to home

  return (
    <div>
        <button>Register</button>
      <br />
      <br />
        <button>Login</button>
    </div>
  );
};

export default AuthModule;