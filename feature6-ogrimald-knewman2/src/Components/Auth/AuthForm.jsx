import React from "react";

// Registration form
const AuthForm = ({ user, isLogin, onChange, onSubmit }) => {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-lg-6 col-md-8 col-sm-10">
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={onSubmit} autoComplete="off">
          {/* First and Last Name for Register */}
          {!isLogin && (
            <div className="row mb-3">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="first-name-input">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first-name-input"
                    value={user.firstName}
                    onChange={onChange}
                    name="firstName"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="last-name-input">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last-name-input"
                    value={user.lastName}
                    onChange={onChange}
                    name="lastName"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group mb-3">
            <label htmlFor="email-input">Email</label>
            <input
              type="email"
              className="form-control"
              id="email-input"
              value={user.email}
              onChange={onChange}
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group mb-3">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              className="form-control"
              id="password-input"
              value={user.password}
              onChange={onChange}
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary btn-lg w-100">
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;