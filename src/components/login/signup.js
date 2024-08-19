import React from "react";
import SignUpImage from "../../assets/signup.svg";
import Logo from "../../assets/logo.png";
import FormHandler from "../../utils/FormHandler";
import { validateSignUp as validate } from "../../utils/validation"; // Alias as validate
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SignUp = () => {
  const navigate = useNavigate();
  const CallbackFunction = () => {
    console.log("Form submitted successfully!");
  };
  const { handleChange, handleSubmit, setValue, initForm, values, errors } =
    FormHandler(CallbackFunction, validate);

  function isLogin() { }

  const handleSignup = async () => {
    try {
      console.log(values);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        values
      );
      navigate("/");
      toast.success(`Successfully Registered`)
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response received from the server.");
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  return (
    <div
      className={
        "vh-100 d-flex align-items-center justify-content-center login"
      }
    >
      <div className="row m-0">
        <div
          className={
            "col-md-6 d-flex align-items-center justify-content-center"
          }
        >
          <div className={"container-widget"}>
            <div className="login-form-inner">
              <form action="#">
                <div className="d-flex align-items-center">
                  <img
                    className={"login-logo d-block mx-auto img-fluid"}
                    src={Logo}
                    alt=""
                  />
                </div>
                <h1 className="brand-text text-center">Time Master</h1>
                <div className="login-field">
                  <input
                    className={`form-control ${errors.username ? "border-red" : ""}`}
                    type="text"
                    name={"username"}
                    onChange={(e) => handleChange(e)}
                    placeholder="Username"
                  />
                </div>
                {errors.username && (<p className={"text-red"}>{errors.username}</p>)}
                <div className="login-field">
                  <input className={`form-control ${errors.email ? "border-red" : ""}`}
                    type="email"
                    name={"email"}
                    onChange={(e) => handleChange(e)}
                    placeholder="User Email"
                  />
                </div>
                {errors.userEmail && (<p className={"text-red"}>{errors.email}</p>)}
                <div className="login-field">
                  <input
                    className={`form-control ${errors.password ? "border-red" : ""}`}
                    type="password"
                    name={"password"}
                    onChange={(e) => handleChange(e)}
                    placeholder="Password"
                  />
                </div>
                {errors.password && (<p className={"text-red"}>{errors.password}</p>)}
                {/* <div className="py-3 text-start">
                      <a href="" className="login-forgot">Forgot Password?</a>
                </div> */}
                <div className="login-btn d-grid pt-3">
                  <button
                    type="button"
                    className={"btn btn-secondary tasks-dropdown-btn flex-end"}
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </div>
                <div className="py-3 text-center">
                  {/* Use Link component to navigate to "/login" */}
                  <Link to="/login" className="login-forgot text-decoration-underline">
                    Already have an account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={"col-md-6 mx-auto"}>
          <div className="d-flex align-items-center justify-content-center">
            <img
              className={
                "login-image img-responsive d-block align-items-center"
              }
              src={SignUpImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
