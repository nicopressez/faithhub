import { Link } from "react-router-dom";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="bg-gray-100 w-screen h-screen pt-[3.5rem]">
      <div
        className=" 
        ml-auto mr-auto mt-20 lg:mt-20 bg-white lg:w-2/4
         rounded-lg drop-shadow-md p-1 pb-8 lg:p-3 lg:pl-10 lg:pr-10 font-Rubik text-center"
      >
        <h2 className=" text-3xl mb-5 text-red-600">Oops! Page not found.</h2>
        <p>
          It seems like you&apos;ve stumbled upon a page that doesn&apos;t exist
          or you don&apos;t have permission to access.
        </p>
        <Link to={"/home"}>
          <button className="mt-5 underline text-red-600 text-lg">
            Back to homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
