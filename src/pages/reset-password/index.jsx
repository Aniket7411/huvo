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
      <section className="login-bg h-screen">
        <div className="go-home absolute right-[30px] top-[20px] z-[1]">
          <Link
            className="text-end text-[#011f4b] font-[Quicksand] font-medium"
            to="/"
          >
            Back to Home
          </Link>
          <div className="h-[2px] bg-[#011f4b] w-[0px] transition-all duration-300"></div>
        </div>
        <div className="absolute z-[1] w-full md:w-[50%] px-5 sm:px-0 right-0 text-center top-[25vh] font-[Quicksand]">
          <p className="font-semibold text-3xl md:4xl xl:text-5xl text-black mb-8">
            RESET PASSWORD
          </p>
          <form onSubmit={handleSubmit(onSubmit)}> 
          <div className="form-control mb-5">
        <input
                className="text-[#5A5A5A] rounded-lg font-medium text-lg  border-[1px] border-black border-solid bg-transparent outline-none w-full sm:w-3/4 xl:w-1/2 p-3"
                placeholder="Enter new Password"
                type="password"
                name="password"
                autoComplete="on"
                {...register("password", {
                  required: "*Password is required.",
                  minLength: {
                    value: 8,
                    message: "*Password should be at-least 8 characters.",
                  },
                })}
              />
              {errors.password && (
                <p className="errorMsg text-[#E40606]">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="form-control mb-5">
              <input
                className="text-[#5A5A5A] rounded-lg font-medium text-lg  border-[1px] border-black border-solid bg-transparent outline-none w-full sm:w-3/4 xl:w-1/2 p-3"
                placeholder="Enter confirm Password"
                type="password"
                name="password"
                autoComplete="on"
                {...register("confirmPassword", {
                  validate: (value) =>
                  value === getValues("password") || "The passwords should match" ,
                  required: "*Password is required.",
                  minLength: {
                    value: 8,
                    message: "*Password should be at-least 8 characters.",
                  },
                })}
              />
              {errors.confirmPassword && (
                <p className="errorMsg text-[#E40606]">
                  {errors.confirmPassword.message}
                </p>
              )}
              </div>
              <button
                      type="submit"
                      className="mt-2 bg-[#011F4B]  text-white xl:text-xl lg:text-lg font-medium p-3  focus:outline-none rounded-lg  text-center w-full sm:w-3/4 xl:w-1/2 font-[QuickSand]"
                    >
                      Save Password
                    </button>
        </form>
        </div>
      </section>
    </>
  )
}
