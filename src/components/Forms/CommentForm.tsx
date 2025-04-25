"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (comment: { text: string; rating: number }) => void;
}

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Veuillez écrire un commentaire");
      return;
    }

    if (rating === 0) {
      setError("Veuillez attribuer une note");
      return;
    }

    onSubmit({ text, rating });
    setText("");
    setRating(0);
    setError("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white p-4 shadow-md"
    >
      <h3 className="md:text-2xl text-xl font-semibold text-[#2ECC71] mb-4">
        Laisser un commentaire
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre note
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none cursor-pointer"
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400 fill-yellow-400 transition-colors duration-300"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre commentaire
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
          rows={4}
          placeholder="Partagez votre expérience avec ce produit..."
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full bg-[#2ECC71] text-white py-2 px-4 cursor-pointercursor-pointer  hover:bg-[#A3BE8C] transition-colors duration-300"
      >
        Publier le commentaire
      </button>
    </motion.form>
  );
};

export default CommentForm;
