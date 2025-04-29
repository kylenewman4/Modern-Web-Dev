import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkUser } from "./AuthService";

// Auth (index) page of site. Upon entering site, user is prompted to register or login for authentication into site features. 
const AuthModule = () => {
  const navigate = useNavigate();

  // redirect already authenticated users back to home
  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in");
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5">
      <h2 className="text-center mb-4">Welcome to Meme Word Games!</h2>

      <div className="d-flex justify-content-around w-50">
        <Link to="/auth/register" className="w-100">
          <button className="btn btn-lg btn-primary w-100 mb-3">Register</button>
        </Link>
      </div>
      
      <div className="d-flex justify-content-around w-50">
        <Link to="/auth/login" className="w-100">
          <button className="btn btn-lg btn-secondary w-100">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default AuthModule;