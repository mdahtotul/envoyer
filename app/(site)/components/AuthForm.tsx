"use client";

import Button from "@/app/components/Buttons/Button";
import Input from "@/app/components/Inputs/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      if (variant === "REGISTER") {
        // register
      }

      if (variant === "LOGIN") {
        // login
      }
    } catch (err) {}
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth social Sign In
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" ? (
            <Input
              id="name"
              label="Name"
              type="text"
              register={register}
              errors={errors}
            />
          ) : null}

          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
          />

          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign In" : "register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
