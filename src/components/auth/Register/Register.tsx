import Link from "next/link";
import FormRegister from "./FormRegister";

const Register = () => {
  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center flex-col gap-y-2">
            <div className="md:w-10   md:h-10 h-8 w-8  flex items-center justify-center bg-[#2ECC71] text-white">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-y-1">
              <h2 className="text-2xl  md:text-3xl font-bold text-center text-gray-900">
                Créer un compte
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#2ECC71] hover:text-[#A3BE8C]"
                >
                  connectez-vous à votre compte existant
                </Link>
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <FormRegister />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
