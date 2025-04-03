import React from "react";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../Auth/AuthService";

// You can pass props using the spread operator to throw them on an object if there are too many to break out
const ProtectedRoute = ({ element: Component, ...rest }) => {
  console.log("element: ", Component);
  const navigate = useNavigate();
  // button logic, returns to auth page
  const goBackHandler = () => {
    Parse.User.logOut();
    navigate("/auth");
  };
  // only allow user to enter home/meme/games page if authenticated
  if (checkUser()) {
    return <Component />;
  } else { // render the prompt to go back
    return (
      <div>
        <p>Unauthorized!</p> <button onClick={goBackHandler}>Go Back.</button>
      </div>
    );
  }
};

export default ProtectedRoute;
