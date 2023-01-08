import { useState } from "react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.scss";
import Input from "../Input";
import Button from "../button";
import axios from "../../api/axios";
import Loader from "../ButtonLoader";
import { Toast } from "../ToastAlert";
import googleSVG from "./assets/google.svg";
import Banner from "./assets/auth-banner.png";
import useAppProvider from "../../hooks/useAppProvider";

const Login = () => {
  const { setAccess } = useAppProvider();
  const navigate = useNavigate();
  const [type] = useState("password");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false
  });

  const [useremail, setUserEmail] = useState();
  const [password, setPassword] = useState();

  const [token, setToken] = useState({
    accessToken: ""
  });

  const location = useLocation();

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value
      };
    });
  }

  async function loginUser(email, password) {
    return axios.post("/auth/login", { email: email, password: password });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(useremail, password);

      if (response.status === 200 || response.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        if (location.state?.from.pathname) {
          navigate(location.state.from);
        } else {
          navigate("/dashboard");
        }
        setLoading(false);
        setAccess(true);
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong"
        });

        setLoading(false);
        throw new Error("Something went wrong");
      }

      const userData = {
        userId: response.data.data.userId,
        name: response.data.data.name,
        token: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
        subscription: response.data.data.subscription
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("profileName", JSON.stringify(userData.name));
    } catch (error) {
      if (error.status === 400) {
        Toast.fire({
          icon: "error",
          title: "A user for this email could not be found"
        });

        setLoading(false);
      } else if (error.status === 401) {
        Toast.fire({
          icon: "error",
          title: "Invalid password, please try again"
        });
        setLoading(false);
      } else if (error.status === 500) {
        Toast.fire({
          icon: "error",
          title: "Internal server Error"
        });

        setLoading(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong"
        });

        setLoading(false);
      }
    }
  };

  // Send access token to backend
  async function loginUserGoogle() {
    const response = await axios.post("/auth/getAuthUrl", {
      authType: "login"
    });

    console.log(response);
    console.log(response?.data.urlAuth);
    if (response) {
      window.location.href = response.data.urlAuth;
    } else {
      navigate("/login");
    }
    // send response to localstorage
    // const userData = {
    //   userId: response.data.data.userId,
    //   name: response.data.data.name,
    //   token: response.data.data.token,
    //   refreshToken: response.data.data.refreshToken,
    //   subscription: response.data.data.subscription
    // };
    // localStorage.setItem("userData", JSON.stringify(userData));
    // localStorage.setItem("profileName", JSON.stringify(userData.name));

    // if (location.state?.from.pathname) {
    //   navigate(location.state.from);
    // } else {
    //   navigate("/dashboard");
    // }
  }
  return (
    <div id="login">
      <div className="authContainer">
        <div className="formDiv">
          <form onSubmit={handleSubmit}>
            <div id="heading">Welcome to Certgo</div>
            <small id="startGenerating">
              Start generating certificates by creating a Certgo account
            </small>

            <div
              onClick={loginUserGoogle}
              id="signupG"
              style={{ cursor: "pointer" }}
            >
              <img alt="" src={googleSVG} id="img_id" />
              Login using Google
            </div>
            {/* <div id="signupA">
              <img alt="" src={appleSVG} id="imgs" />
              Login using Apple
            </div> */}
            <div id="hrLine">
              <span id="or">or</span>
            </div>
            {/* <div id="email"> */}
            {/* <img alt="" src={emailSVG} /> */}
            <Input
              label={"Email"}
              id="email_input"
              placeholder=" Email"
              type="text"
              name="email"
              callback={e => setUserEmail(e.target.value)}
              required
              value={useremail}
            />
            {/* </div> */}
            {/* <div id="pwd"> */}
            {/* <img alt="" src={keySVG} /> */}
            <Input
              label={"Password"}
              id="input_id"
              placeholder="Password"
              type={type}
              name="password"
              value={password}
              callback={e => setPassword(e.target.value)}
              required
              className="pw_input"
              eyecon={true}
            />

            {/* </div> */}

            <div className="forgotPwd">
              <Link to="/resetpassword">Forgot password?</Link>
            </div>
            <div id="checkTerms">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                name="acceptTerms"
              />
              <label id="labels" htmlFor="acceptTerms">
                Remember me
              </label>
            </div>
            <div>
              <Button id="btn" onClick={handleSubmit} style={{ width: "100%" }}>
                {loading ? <Loader /> : <span>Login</span>}
              </Button>
            </div>
          </form>
          <p className="haveAccount">
            Don’t have a Certgo account?{" "}
            <Link to="/signup" id="coloredTerms">
              Create an account{" "}
            </Link>
          </p>
        </div>
        <div className="emptySpace">
          <img className="cert_img" alt="" src={Banner} />
        </div>
      </div>
    </div>
  );
};
export default Login;
