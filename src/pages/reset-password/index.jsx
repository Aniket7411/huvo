import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(
    Object.fromEntries(searchParams.entries())
  );
  console.log('-----------', query)
  const [token, setToken] = useState(query?.token);
  const newPasswordSchema = Yup.object().shape({
    new_password: Yup.string()
      .required("Please enter your Password")
      .min(5, "Password must have at least 5 characters")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])\w+/,
        "Password should contain at least one uppercase and lowercase character"
      )
      .matches(/\d/, "Password should contain at least one number")
      .matches(
        /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
        "Password should contain at least one special character"
      ),
    confirm_password: Yup.string().when(
      "password",
      (new_password, field) => {
        if (new_password) {
          return field
            .required("The Passwords do not match")
            .oneOf([Yup.ref("new_password")], "The Passwords do not match");
        }
      }
    ),
  });
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
      } = useForm({
        resolver: yupResolver(newPasswordSchema)
      });
    const onSubmit = async(data) =>{
      try {
        console.log(data)
        data.secret_token = token;
        const response = await HttpClient.post(
          "/users/resetPassword",
          data
        );
        // resetForm();
        toast.success(response.message);
        navigate("/login");
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    }
  return (
    <>
  <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-600 mb-6">Please enter your new password</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              New Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter new password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "*Password is required",
                minLength: {
                  value: 8,
                  message: "*Password should be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 text-left">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Confirm your password"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === getValues("password") || "The passwords do not match",
                required: "*Please confirm your password",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 text-left">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  </section>
</>
  )
}
