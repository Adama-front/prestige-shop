// src/components/auth/Register/FormRegister.tsx
"use client";
import Alert from "@/components/ui/Alert";
import { register } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const FormRegister = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("error");

  // Afficher les erreurs de l'API
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [error]);

  // Rediriger après une inscription réussie
  useEffect(() => {
    if (status === "succeeded") {
      setAlertMessage("Inscription réussie ! Veuillez vous connecter.");
      setAlertType("success");
      setShowAlert(true);

      // Réinitialiser le formulaire
      setFormData({ username: "", email: "", password: "" });

      // Rediriger vers la page de login après un délai
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [status, router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: ""
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };

        await dispatch(register(userData)).unwrap();
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formErrors.username ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2ECC71] focus:border-[#2ECC71] focus:z-10 sm:text-sm`}
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formErrors.email ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2ECC71] focus:border-[#2ECC71] focus:z-10 sm:text-sm`}
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formErrors.password ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2ECC71] focus:border-[#2ECC71] focus:z-10 sm:text-sm`}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={status === "loading"}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium  text-white bg-[#2ECC71] hover:bg-[#A3BE8C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ECC71] ${
              status === "loading" ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {status === "loading" ? (
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            ) : null}
            {status === "loading" ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
