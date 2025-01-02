import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../features/user/userSlice";
import api from "../../services/api";
const SignupSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Too Short!").required("Required"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async (values) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/signup", values);
      setIsLoading(false);
      dispatch(setUser(response.data));
      // localStorage.setItem("accessToken", response.data.user.accessToken);
      // localStorage.setItem("refreshToken", response.data.user.refreshToken);
      // localStorage.setItem("userId", response.data.user._id);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.errors ||
        "An error occurred during signup";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <Formik
          initialValues={{ userName: "", email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSignup(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <Field
                    type="text"
                    name="userName"
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="password"
                    name="password"
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isLoading ? "Registering..." : "Sign up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
