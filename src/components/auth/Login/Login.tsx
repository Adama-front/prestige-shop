import FormLogin from "./FormLogin";

const Login = () => {
  return (
    <section className="bg-white text-black pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center gap-y-6">
          <div className="flex w-full items-center justify-center flex-col gap-y-2">
            <div className="md:w-10 md:h-10 h-8 w-8 flex items-center justify-center bg-[#2ECC71] text-white">
              <svg
                className="w-6 h-6 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                Connexion
              </h2>
            </div>
          </div>
          <div className="w-full flex items-center justify-center ">
            <FormLogin />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
