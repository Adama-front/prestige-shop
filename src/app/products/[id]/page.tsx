"use client";
import CardProductDetail from "@/components/Cards/CardProductDetail";
import CommentForm from "@/components/Forms/CommentForm";
import { getById } from "@/store/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  productId: number;
  userId: number;
  text: string;
  rating: number;
  createdAt: string;
}

const Detail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selectedProduct, status, error } = useAppSelector(
    (state) => state.products
  );
  const [comments, setComments] = useState<Comment[]>([]);
  // const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 2;

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(getById(parseInt(id as string, 10)));
      // Simuler le chargement des commentaires existants
      setComments([
        {
          id: 1,
          productId: parseInt(id as string, 10),
          userId: 1,
          text: "Excellent produit, je recommande !",
          rating: 5,
          createdAt: "2024-03-15T10:00:00Z"
        },
        {
          id: 2,
          productId: parseInt(id as string, 10),
          userId: 2,
          text: "Très bon rapport qualité-prix",
          rating: 4,
          createdAt: "2024-03-16T15:30:00Z"
        },
        {
          id: 3,
          productId: parseInt(id as string, 10),
          userId: 3,
          text: "Livraison rapide, produit conforme",
          rating: 5,
          createdAt: "2024-03-17T09:15:00Z"
        },
        {
          id: 4,
          productId: parseInt(id as string, 10),
          userId: 4,
          text: "Satisfait de mon achat",
          rating: 4,
          createdAt: "2024-03-18T14:20:00Z"
        }
      ]);
    }
  }, [dispatch, id]);

  const handleCommentSubmit = async (comment: {
    text: string;
    rating: number;
  }) => {
    const newComment: Comment = {
      id: comments.length + 1,
      productId: parseInt(id as string, 10),
      userId: 1,
      text: comment.text,
      rating: comment.rating,
      createdAt: new Date().toISOString()
    };

    setComments([...comments, newComment]);
    // setShowSuccess(true);
    // setTimeout(() => setShowSuccess(false), 3000);
  };

  // Calcul de la pagination
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2ECC71]"></div>
      </div>
    );

  if (status === "failed")
    return (
      <div className="min-h-screen flex flex-col gap-y-3 items-center justify-center w-full px-4 text-lg">
        <p>Erreur : {error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#2ECC71] text-white duration-300 text-sm cursor-pointer hover:bg-[#A3BE8C] transition-colors"
        >
          Retour
        </button>
      </div>
    );

  if (!selectedProduct)
    return (
      <div className="min-h-screen flex items-center justify-center w-full px-4 text-lg">
        Produit introuvable
      </div>
    );

  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
              Tout Ce Que Vous Devez Savoir
            </h2>
          </div>
          <div className="w-full flex items-start">
            <button
              onClick={() => router.back()}
              className="md:px-3 md:py-2 py-1.5 px-2 flex items-center gap-x-1 justify-center bg-[#2ECC71] text-white duration-300 text-xs md:text-sm cursor-pointer hover:bg-[#A3BE8C] transition-colors"
            >
              <svg
                className="md:w-6 md:h-6 w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
              <span>Retour</span>
            </button>
          </div>
          <div className="w-full pt-5">
            <CardProductDetail product={selectedProduct} />
          </div>

          {/* Section des commentaires */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative">
            {/* {showSuccess && (
              <div className="absolute top-0 left-1/2 transform  -translate-x-1/2 -translate-y-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 z-10">
                Votre commentaire a été publié avec succès !
              </div>
            )} */}

            {/* Formulaire de commentaire - Premier sur mobile */}
            <div className="order-1 md:order-2">
              <CommentForm onSubmit={handleCommentSubmit} />
            </div>

            {/* Liste des commentaires - Deuxième sur mobile */}
            <div className="w-full flex flex-col items-start gap-y-5 order-2 md:order-1">
              <h3 className="md:text-2xl text-xl font-semibold text-[#2ECC71]">
                Commentaires ({comments.length})
              </h3>
              <div className="space-y-6 w-full">
                {currentComments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < comment.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center w-full gap-2 mt-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 cursor-pointer  ${
                      currentPage === 1
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-[#2ECC71] hover:bg-[#A3BE8C]"
                    } text-white transition-colors duration-300`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-600 text-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1 cursor-pointer  ${
                      currentPage === totalPages
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-[#2ECC71] hover:bg-[#A3BE8C]"
                    } text-white transition-colors duration-300`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
