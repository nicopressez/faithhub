import { PropTypes } from "prop-types";

const NewPostLoading = ({own}) => {
    return (
        <div
          className={`ml-auto mr-auto mt-5 md:mt-20 bg-gradient-to-b from-gray-200 to-gray-300
             rounded-lg drop-shadow-md p-3 md:p-5 font-Rubik
             relative h-56 animate-pulse
             ${own ? "lg:w-[60%]" : "lg:w-[50%]"}`}
        >
            </div>)
}

NewPostLoading.propTypes = {
    own: PropTypes.bool
}

export default NewPostLoading