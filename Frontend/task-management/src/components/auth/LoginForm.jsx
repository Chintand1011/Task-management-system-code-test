import React from "react";
import { useForm } from "react-hook-form";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm(){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();

  const onSubmit = async data => {
    const res = await axios.post("/auth/login", data);
    login(res.data.token);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email", { required: "Email required" })} placeholder="Email"/>
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" {...register("password", { required: "Password required" })} placeholder="Password"/>
      {errors.password && <p>{errors.password.message}</p>}
      <button disabled={isSubmitting}>Login</button>
    </form>
  );
}
