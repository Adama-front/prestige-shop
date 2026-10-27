"use client";
import Alert from "@/presentation/components/ui/Alert";
import { login } from "@/application/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
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
    <div className="w-full space-y-6">
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#171B18]">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              aria-invalid={Boolean(formErrors.username)}
              aria-describedby={formErrors.username ? "username-error" : undefined}
              className={`block w-full border bg-white px-4 py-3 text-[#171B18] placeholder:text-[#8A918B] focus:border-[#F98909] focus:outline-none focus:ring-2 focus:ring-[#F98909]/20 ${
                formErrors.username ? "border-red-500" : "border-[#DCE1D8]"
              }`}
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p id="username-error" role="alert" className="mt-1 text-sm text-red-600">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#171B18]">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-invalid={Boolean(formErrors.password)}
              aria-describedby={formErrors.password ? "password-error" : undefined}
              className={`block w-full border bg-white px-4 py-3 text-[#171B18] placeholder:text-[#8A918B] focus:border-[#F98909] focus:outline-none focus:ring-2 focus:ring-[#F98909]/20 ${
                formErrors.password ? "border-red-500" : "border-[#DCE1D8]"
              }`}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={status === "loading" || isSubmitting}
            className={`group relative w-full cursor-pointer flex justify-center py-3 px-5 font-semibold text-[#171B18] bg-[#F98909] transition-colors hover:bg-[#D9EC8B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CC6500] ${
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
          <div className="mt-4 text-right text-sm">
            <span className="text-[#667069]">Mot de passe oublié ? Réinitialisation bientôt disponible.</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
