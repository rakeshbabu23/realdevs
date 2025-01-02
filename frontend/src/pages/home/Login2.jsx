import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../features/user/userSlice";
import api from "../../services/api";
function LoginSignupFlow() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authFlow, setAuthFlow] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // Refs to directly access input elements
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleUsernameEnter = (event) => {
    if (event.key === "Enter") {
      if (validateUsername(username)) {
        setStep(2);
      } else {
        alert("Please enter username of atleast 3 characters");
      }
    }
  };

  const handleEmailEnter = (event) => {
    if (event.key === "Enter") {
      if (validateEmail(email)) {
        setStep(3);
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const handlePasswordEnter = (event) => {
    if (event.key === "Enter") {
      if (validatePassword(password)) {
        setStep(4);
      } else {
        alert(
          "Password must be at least 8 characters long and contain at least one numeric digit and one special symbol."
        );
      }
    }
  };
  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", values);
      setIsLoading(false);
      dispatch(setUser(response.data));
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };
  const handleSignup = async (values) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/signup", values);
      setIsLoading(false);
      dispatch(setUser(response.data));
      navigate("/dashboard");
    } catch (error) {
      console.log("Error: " + error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.errors ||
        "An error occurred during signup";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "1") {
        setAuthFlow("login");
        setStep(2);
        event.preventDefault();
      } else if (event.key === "2") {
        setAuthFlow("signup");
        setStep(1);
        event.preventDefault();
      }
    };
    const handleArrowUpArrowDown = (event) => {
      if (event.key === "ArrowUp" && step > 0) {
        setStep((prev) => prev - 1);
        event.preventDefault();
      } else if (event.key === "ArrowDown" && step < 4 && step > 0) {
        if (authFlow === "signup" && username) {
          setStep((prev) => prev + 1);
        }

        event.preventDefault();
      }
    };

    if (step === 0) {
      window.addEventListener("keydown", handleKeyDown);
    }
    window.addEventListener("keydown", handleArrowUpArrowDown);
    if (step === 4) {
      if (authFlow === "login") {
        handleLogin({ password: password, email: email });
      } else {
        handleSignup({ userName: username, password: password, email: email });
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleArrowUpArrowDown);
    };
  }, [step]);

  // Set focus on the input based on the current step
  useEffect(() => {
    if (step === 1 && usernameRef.current) {
      usernameRef.current.focus();
    } else if (step === 2 && emailRef.current) {
      emailRef.current.focus();
    } else if (step === 3 && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [step]);

  // Validation functions
  const validateUsername = (username) => username.length >= 3;
  const validateEmail = (email) => {
    const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (test) {
      setEmailError(false);
      return true;
    } else {
      setEmailError(true);
      return false;
    }
  };
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\{}\[\]:;"'<>,.?/~`])[A-Za-z0-9!@#$%^&*()_\-+=|\\{}\[\]:;"'<>,.?/~`]{8,}$/;
    const test = passwordPattern.test(password);
    if (test) {
      setPasswordError(false);
      return true;
    } else {
      setPasswordError(true);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-500 p-8">
      <div className="max-sm:w-[100%]  md:w-[80%] h-[80vh]">
        {" "}
        {/* Set height to 80% of viewport height */}
        <div className="bg-gray-700 rounded-t-md w-full p-1">
          <div className="flex gap-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="bg-black text-white p-4 rounded-b-md w-full focus:outline-none focus:outline-transparent h-full">
          <div className="bg-black text-white p-4 w-full">
            <div>
              <span className="text-green-400">realdevs@~</span>
              <span> I want to</span>
              <p>1. Login</p>
              <p>2. Signup</p>
            </div>
          </div>

          {/* Step 1: Username */}
          {authFlow === "signup" && step >= 1 && (
            <div className="bg-black text-white p-4 w-full">
              <p className="text-green-400">
                realdevs@~ Please enter your username
              </p>
              <input
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameEnter}
                className={`border-0 outline-none focus:outline-none bg-black ${
                  username.length < 3 ? "text-red-500" : "text-green-500"
                } w-full`}
              />
            </div>
          )}

          {/* Step 2: Email */}
          {step >= 2 && (
            <div className="bg-black text-white p-4 w-full">
              <p className="text-green-400">
                realdevs@~ Please enter your email
              </p>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(email);
                }}
                onKeyDown={handleEmailEnter}
                className={`border-0 outline-none focus:border-black bg-black ${
                  emailError ? "text-red-500" : "text-green-500"
                } w-full`}
              />
            </div>
          )}

          {/* Step 3: Password */}
          {step >= 3 && (
            <div className="bg-black text-white p-4 w-full">
              <p className="text-green-400">
                realdevs@~ Please enter your password
              </p>
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordEnter}
                className="border-0 outline-none focus:outline-none bg-black text-green-500 w-full"
              />
            </div>
          )}

          {/* Step 4: Success Message */}
          {step === 4 && (
            <div className="bg-black text-white p-4 w-full">
              <p className="text-green-400">Please wait...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginSignupFlow;
