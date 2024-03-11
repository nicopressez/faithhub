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
          className={`ml-auto mr-auto mt-5 md:mt-20 bg-gradient-to-b from-gray-200 to-gray-300
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative h-56 animate-pulse
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
            </div>
            <div
          className={`ml-auto mr-auto mt-5 md:mt-20 bg-gradient-to-b from-gray-200 to-gray-300
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative h-56 animate-pulse
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
            </div>
        </Transition>
    )
}

PostsLoading.propTypes = {
    own: PropTypes.bool
}

export default PostsLoading