"use client";
import Alert from "@/presentation/components/ui/Alert";
import { login } from "@/application/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const FormLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: ""
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Afficher les erreurs de l'API
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      setShowAlert(true);
    }
  }, [error]);

  // Rediriger après une connexion réussie
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      setAlertMessage("Connexion réussie !");
      setAlertType("success");
      setShowAlert(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [status, isAuthenticated, router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: ""
    };

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && !isSubmitting && status !== "loading") {
      setIsSubmitting(true);
      try {
        await dispatch(login(formData)).unwrap();
      } catch (err) {
        void err;
      } finally {
        setIsSubmitting(false);
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
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F98909] focus:border-[#F98909] focus:z-10 sm:text-sm`}
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
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
              autoComplete="current-password"
              required
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formErrors.password ? "border-red-300" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F98909] focus:border-[#F98909] focus:z-10 sm:text-sm`}
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
            disabled={status === "loading" || isSubmitting}
            className={`group relative w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-[#171B18] bg-[#F98909] hover:bg-[#D9EC8B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F98909] ${
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
            {status === "loading" ? "Connexion en cours..." : "Se connecter"}
          </button>
          <div className="flex items-center justify-between w-full mt-4 text-xs md:text-sm text-[#F98909]">
            <span className="text-[#667069]">Réinitialisation bientôt disponible</span>
            <Link
              href="/register"
              className="font-medium text-[#F98909] hover:text-[#CC6500]"
            >
              Pas de compte ? Inscrivez-vous
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
