"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { motionTokens, scrollReveal } from "@/shared/motion/motionTokens";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const prefersReducedMotion = useReducedMotion();
  const revealDistance = prefersReducedMotion
    ? 0
    : motionTokens.distance.medium;
  const duration = prefersReducedMotion
    ? motionTokens.duration.fast
    : motionTokens.duration.normal;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitStatus({
        success: true,
        error: false,
        message: "Merci pour votre message. Nous vous répondrons bientôt !"
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <section className="pb-16 pt-32  bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...scrollReveal("up", prefersReducedMotion)}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#F98909] mb-4">
            Contactez-Nous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question ou un commentaire ? Nous sommes là pour vous aider.
            Remplissez le formulaire ci-dessous et nous vous répondrons dans les
            plus brefs délais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            {...scrollReveal("left", prefersReducedMotion, motionTokens.stagger * 2)}
            className="lg:col-span-1"
          >
            <div className="bg-white p-4 shadow-xl">
              <h2 className="md:text-2xl text-xl text-center md:text-left  font-semibold text-[#F98909] mb-6">
                Informations de Contact
              </h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-[#F98909] mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Adresse</h3>
                    <p className="text-gray-600">
                      123 Rue Principale, Ville, Pays
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-[#F98909] mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+1 234 567 890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-[#F98909] mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@example.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-[#F98909] mt-1" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Horaires</h3>
                    <p className="text-gray-600">Lun - Ven, 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 shadow-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645454332403!5m2!1sen!2s"
                className="w-full h-64 border-0"
                allowFullScreen
                loading="lazy"
                title="Location Map"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            {...scrollReveal("right", prefersReducedMotion, motionTokens.stagger * 4)}
            className="lg:col-span-2"
          >
            <div className="bg-white p-4 shadow-xl">
              <AnimatePresence mode="sync">
                {(submitStatus.success || submitStatus.error) && (
                  <motion.div
                    key={submitStatus.message}
                    initial={{ opacity: 0, y: revealDistance }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -motionTokens.distance.small }}
                    transition={{ duration, ease: motionTokens.easing }}
                    role="status"
                    className={`p-4 mb-6 ${submitStatus.success ? "bg-[#E8EBE3] text-[#171B18]" : "bg-red-100 text-red-700"}`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom<sup className="text-[#F98909]">*</sup>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#F98909] ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email<sup className="text-[#F98909]">*</sup>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#F98909] ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sujet<sup className="text-[#F98909]">*</sup>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#F98909] ${
                      formErrors.subject ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message<sup className="text-[#F98909]">*</sup>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#F98909] ${
                      formErrors.message ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#F98909] text-[#171B18] py-3 px-6 font-medium cursor-pointer hover:bg-[#D9EC8B] transition-colors duration-300"
                >
                  Envoyer le Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
