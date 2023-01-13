import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./signup.scss";
import Input from "../Input";
import Button from "../button";
import Loader from "../ButtonLoader";
import { Toast } from "../ToastAlert";
import googleSVG from "./assets/google.svg";
import axios, { baseURL } from "../../api/axios";
import Logo from "./assets/certgo-logo.svg";
import Banner from "./assets/auth-banner.png";
import useAppProvider from "../../hooks/useAppProvider";

const Signup = () => {
  const { setAccess } = useAppProvider();
  const navigate = useNavigate();
  const location = useLocation();

  // const [type, setType] = useState("password");
  const type = "password";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    checkbox: ""
  });
  // const [userName, setUserName] = useState();
  const [useremail, setUserEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [checkbox, setCheckbox] = useState(false);

  // const [error, setError] = useState(false);
  const [token, setToken] = useState({
    accessToken: ""
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value
      };
    });
  }

  async function createNewUser(email, password, checkbox) {
    return fetch(`${baseURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        checkbox: checkbox
      })
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (useremail === "") {
        Toast.fire({
          icon: "error",
          title: "email cannot be empty"
        });
      } else if (password.length < 6 && password.length < 6) {
        Toast.fire({
          icon: "error",
          title: "Passwords cannot be less than 6"
        });
        setLoading(false);
        return false;
      } else if (confirmPassword !== password) {
        Toast.fire({
          icon: "error",
          title: "Both passwords do not match"
        });
        setLoading(false);
        return false;
      } else {
        const response = await createNewUser(useremail, password);
        if (response.status === 200 || response.status === 201) {
          Toast.fire({
            icon: "success",
            title: "Signed up successfully"
          });
          if (location.state?.from.pathname) {
            navigate(location.state.from);
          } else {
            navigate("/login");
          }
          setLoading(false);
          setAccess(true);
        } else if (response.status === 401) {
          Toast.fire({
            icon: "error",
            title: "Email already exists, login"
          });
          setLoading(false);
          throw new Error("Email already exists, login");
        } else if (response.status === 400) {
          Toast.fire({
            icon: "error",
            title: "all fields are required"
          });
          setLoading(false);
          throw new Error("all fields are required");
        } else if (response.status === 500) {
          Toast.fire({
            icon: "error",
            title: "Server Error"
          });
          setLoading(false);
          throw new Error("Server Error");
        } else {
          Toast.fire({
            icon: "error",
            title: "Something went wrong"
          });
          setLoading(false);
          throw new Error("Something went wrong");
        }
      }
      // const token = response.data.token;
      // localStorage.setItem("token", token);
    } catch (error) {
      setLoading(false);
    }
  };
  async function getCode() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.code) {
      console.log(params.code);
      const res = await axios.post("/auth/signup", { code: params.code });
      console.log(res);
      try {
        if (res.status === 200 || res.status === 201) {
          Toast.fire({
            icon: "success",
            title: "Signed up successfully"
          });
          if (location.state?.from.pathname) {
            navigate(location.state.from);
          } else {
            navigate("/login");
          }
          setAccess(true);
        }
      } catch (error) {
        if (error.status === 401) {
          Toast.fire({
            icon: "error",
            title: "A user with this email already exists"
          });
          setLoading(false);
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
        }
      }
    }
  }
  useEffect(() => {
    getCode();
  }, []);
  // Send access token to backend
  async function createNewUserGoogle() {
    const response = await axios.post("/auth/getAuthUrl", {
      authType: "signup"
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
    <div id="signup">
      <div className="authContainer">
        <div className="left-pane">
          <div className="brand-logo">
            <img src={Logo} alt="certgo-logo" />
          </div>
          <div className="formDiv">
            <div id="heading">Welcome to Certgo</div>
            <span id="startGenerating">
              Start generating certificates by creating a Certgo account
            </span>
            <div
              onClick={createNewUserGoogle}
              id="signupG"
              style={{ cursor: "pointer" }}
            >
              <img alt="" src={googleSVG} id="img_id" />
              Signup using Google
              {/* <a href="#">Signup using Google</a> */}
            </div>
            {/* <div id="signupA">
            <img alt="" src={appleSVG} id="img_id" />
            Signup using Apple
          </div> */}
            <div id="hrLine">
              <span id="or">or</span>
            </div>
            <form>
              {/* <div id="email"> */}
              {/* <img alt="" src={emailSVG} /> */}
              {/* <Input
              label="Name"
              className="email_input"
              placeholder=" Name"
              type="text"
              name="name"
              callback={e => setUserName(e.target.value)}
              required
              value={userName}
            /> */}
              <Input
                label="Email"
                className="email_input"
                placeholder=" Email"
                type="email"
                name="email"
                callback={e => setUserEmail(e.target.value)}
                required
                value={useremail}
              />
              <Input
                label="Create Password"
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
              <Input
                label="Confirm Password"
                id="input_id"
                placeholder="Password"
                type={type}
                name="password"
                value={confirmPassword}
                callback={e => setConfirmPassword(e.target.value)}
                required
                className="pw_input"
                eyecon={true}
              />
              <div id="checkTerms">
                <input
                  type="checkbox"
                  id="checkbox"
                  value={checkbox}
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  name="acceptTerms"
                  callback={e => setCheckbox(e.target.value)}
                  required
                />
                <div className="termsOfUse">
                  By creating an account, I declare that I have read and
                  accepted Certgo’s <span id="coloredTerms"> Terms of Use</span>{" "}
                  and
                  <span id="coloredTerms"> Privacy Policy</span>
                </div>
              </div>

              <div>
                <Button
                  id="btn"
                  onClick={handleSubmit}
                  style={{ width: "100%" }}
                >
                  {loading ? <Loader /> : <span>Create Account</span>}
                </Button>
              </div>
            </form>
            <p className="haveAccount">
              Already have a Certgo account?{" "}
              <Link to="/login" id="coloredTerms">
                Login
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
export default Signup;
