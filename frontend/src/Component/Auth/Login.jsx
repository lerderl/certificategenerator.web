import { useState, useEffect } from "react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.scss";
import Input from "../Input";
import Button from "../button";
import axios from "../../api/axios";
import Loader from "../ButtonLoader";
import { Toast } from "../ToastAlert";
import googleSVG from "./assets/google.svg";
import Banner from "./assets/auth-banner.png";
import Logo from "./assets/certgo-logo.svg";
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

        setLoading(false);
        setAccess(true);
        navigate("/dashboard");
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
  async function getCode() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.code) {
      console.log(params.code);
      const res = await axios.post("/auth/login", { code: params.code });
      console.log(res.status);
      try {
        if (res.status === 200 || res.status === 201) {
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
          setAccess(true);
          navigate("/dashboard");
          const userData = {
            userId: res.data.data.userId,
            name: res.data.data.name,
            token: res.data.data.token,
            refreshToken: res.data.data.refreshToken,
            subscription: res.data.data.subscription
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("profileName", JSON.stringify(userData.name));
        }
      } catch (error) {
        if (error.status === 401) {
          Toast.fire({
            icon: "error",
            title: "A user with this email could not be found."
          });
        } else if (error.status === 500) {
          Toast.fire({
            icon: "error",
            title: "Internal server Error"
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "Something went wrong"
          });

          setLoading(false);
        }
      }
    }
  }
  useEffect(() => {
    getCode();
  }, []);
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
  }
  return (
    <div id="login">
      <div className="authContainer">
        <div className="left-pane">
          <div className="brand-logo">
            <img src={Logo} alt="certgo-logo" />
          </div>
          <div className="formDiv">
            <form onSubmit={handleSubmit}>
              <div id="heading">Welcome back</div>
              <small id="startGenerating">
                Continue generating certificates by logging in to your Certgo
                account
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
                <Link to="/resetpassword" className="forgotPwd">
                  Forgot password?
                </Link>
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
                <Button
                  id="btn"
                  onClick={handleSubmit}
                  style={{ width: "100%" }}
                >
                  {loading ? <Loader /> : <span>Login</span>}
                </Button>
              </div>
            </form>
            <p className="haveAccount">
              Don’t have a Certgo account?{" "}
              <Link to="/signup" id="coloredTerms">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="right-pane">
          <img className="cert_img" alt="" src={Banner} />
        </div>
      </div>
    </div>
  );
};
export default Login;
