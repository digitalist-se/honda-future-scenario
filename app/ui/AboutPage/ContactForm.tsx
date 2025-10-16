"use client";

import "./ContactForm.css";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

type Inputs = {
  firstLastName: string;
  email: string;
  message: string;
  verified: boolean; // Used for user verification
};

export const ContactForm = () => {
  const [showThankYou, setShowThankYou] = useState<boolean>(false);

  const methods = useForm<Inputs>();

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // First verify user via invisible reCAPTCHA v3 if reCAPTCHA site key is provided. Assume recaptcha is not enabled if key is not provided.
    if (process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY) {
      const token = await grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY,
        {
          action: "submit",
        }
      );
      const response_recaptcha = await fetch("/api/recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      const result_recaptcha = await response_recaptcha.json();
      if (!result_recaptcha.success) {
        setError("verified", {
          type: "custom",
          message: "Sorry, failed user verification. Please contact support.",
        });

        return;
      }
    }
    clearErrors("verified");

    const formData = new FormData();
    formData.append("firstLastName", data.firstLastName);
    formData.append("email", data.email);
    formData.append("message", data.message);

    const response = await fetch("/api/form_contact", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      setShowThankYou(true);
    } else {
      console.error(result.error);
    }
  };

  useEffect(() => {
    // Add class to show reCAPTCHA badge
    document.body.classList.add("show-recaptcha-badge");

    return () => {
      document.body.classList.remove("show-recaptcha-badge");
    };
  }, []);

  return showThankYou ? (
    <div className="thank-you-wrapper">
      Thank you, your message has been sent!
    </div>
  ) : (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <div className="form-item">
          <label htmlFor="firstLastName">First name, Last name</label>
          <div>
            <input
              id="firstLastName"
              type="text"
              placeholder={""}
              {...register("firstLastName", { required: true })}
            />
          </div>

          {errors.firstLastName && (
            <div className="form-item-error">
              <span>This field is required</span>
            </div>
          )}
        </div>

        <div className="form-item">
          <label htmlFor="email">E-mail</label>
          <div>
            <input
              id="email"
              type="email"
              placeholder={""}
              {...register("email", { required: true })}
            />
          </div>

          {errors.email && (
            <div className="form-item-error">
              <span>This field is required</span>
            </div>
          )}
        </div>

        <div className="form-item">
          <label htmlFor="message">Your message</label>
          <div>
            <textarea
              id="message"
              placeholder={""}
              rows={11}
              {...register("message", { required: true })}
            />
          </div>

          {errors.message && (
            <div className="form-item-error">
              <span>This field is required</span>
            </div>
          )}
        </div>

        {/* reCATPCHA verification error */}
        <div>
          {errors.verified && (
            <div className="form-item-error">
              <span>User failed verification</span>
            </div>
          )}
        </div>

        <div>
          <button className="button" type="submit" disabled={isSubmitting}>
            Send
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
