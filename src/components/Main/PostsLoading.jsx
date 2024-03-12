import { Transition } from "@headlessui/react";
import { PropTypes } from "prop-types";

const PostsLoading = ({own}) => {
    return (
        <Transition
        appear={true}
        show={true}
        enter="transition duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100">
        <div
          className={`ml-auto mr-auto mt-10 lg:mt-20 bg-gradient-to-b from-gray-200 to-gray-200
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative h-48 md:h-56 animate-pulse
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
            <div
              className=" float-left bg-gradient-to-b from-gray-300 to-gray-400
                     w-9 h-9 mr-2 md:mr-4 md:w-11 md:h-11 rounded-full
                     animate-pulse"
            />
            <div className="float-right md:mr-3 bg-gradient-to-b from-gray-300 to-gray-400
             w-20 md:w-32 h-3 md:h-4 rounded-full "> </div>
             <div className="ml-[3.5rem] bg-gradient-to-b from-gray-300 to-gray-400
             w-32 md:w-40 h-3 md:h-4 rounded-lg "> </div>
             <div className="ml-[3.5rem] mt-2 bg-gradient-to-b from-gray-300 to-gray-400
             w-12 md:w-16 h-2 md:h-3 rounded-lg "> </div>

            <div className="mt-10 bg-gradient-to-b from-gray-300 to-gray-400
             w-44 md:w-96 h-3 rounded-lg "> </div>
             <div className="float-right mt-8 md:mr-3 bg-gradient-to-b from-gray-300 to-gray-400
             w-20 h-3 rounded-lg "> </div>
             <div className="mt-8 bg-gradient-to-b from-gray-300 to-gray-400
             w-8 h-3 rounded-lg "> </div>
          

            </div>
            <div
          className={`mb-5 ml-auto mr-auto mt-10 lg:mt-20 bg-gradient-to-b from-gray-200 to-gray-200
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative h-48 md:h-56 animate-pulse
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
            <div
              className=" float-left bg-gradient-to-b from-gray-300 to-gray-400
                     w-9 h-9 mr-2 md:mr-4 md:w-11 md:h-11 rounded-full
                     animate-pulse"
            />
            <div className="float-right md:mr-3 bg-gradient-to-b from-gray-300 to-gray-400
             w-20 md:w-32 h-3 md:h-4 rounded-full "> </div>
             <div className="ml-[3.5rem] bg-gradient-to-b from-gray-300 to-gray-400
             w-32 md:w-40 h-3 md:h-4 rounded-lg "> </div>
             <div className="ml-[3.5rem] mt-2 bg-gradient-to-b from-gray-300 to-gray-400
             w-12 md:w-16 h-2 md:h-3 rounded-lg "> </div>

            <div className="mt-10 bg-gradient-to-b from-gray-300 to-gray-400
             w-44 md:w-96 h-3 rounded-lg "> </div>
             <div className="float-right mt-8 md:mr-3 bg-gradient-to-b from-gray-300 to-gray-400
             w-20 h-3 rounded-lg "> </div>
             <div className="mt-8 bg-gradient-to-b from-gray-300 to-gray-400
             w-8 h-3 rounded-lg "> </div>
          

            </div>
        </Transition>
    )
}

PostsLoading.propTypes = {
    own: PropTypes.bool
}

export default PostsLoading