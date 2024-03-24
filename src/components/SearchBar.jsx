import { Transition } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { PropTypes } from "prop-types";

const SearchBar = ({ setSearchVisible, searchVisible }) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible, searchInputRef]);

  // Get device size for big screens
  const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchInput(query);
    try {
      if (query.length > 3) {
        setLoading(true);
        const response = await fetch(
          `https://faithhub-backend.fly.dev/profile/searchbar?query=${query}`,
        );
        const result = await response.json();
        setSearchResults(result.data);
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    } catch (err) {
      setError(true);
    }
  };

  const clearInput = () => {
    // When clicking away to a search result, clear input info and state
    setSearchInput("");
    setSearchVisible(false);
  };
  return (
    <Transition
      appear={true}
      show={true}
      enter={!isLargeDevice ? "transition duration-200" : ""}
      enterFrom="opacity-0 transform scale-x-0 origin-left"
      enterTo="opacity-100 transform scale-x-100 origin-left"
    >
      <div
        className="relative group font-Rubik
    "
      >
        <form>
          <input
            ref={searchInputRef}
            onChange={handleSearch}
            value={searchInput}
            type="text"
            placeholder="Search... "
            className="
            bg-gray-100  flex lg:w-auto p-1 pl-3 pr-3 lg:pr-10 ml-3 lg:ml-8 rounded-large"
          ></input>
        </form>
        {searchResults && searchInput.length > 3 && (
          <div
            className="w-64 absolute top-10 left-3 lg:left-8 bg-white border-2 rounded-lg flex-col
        w-98 hidden group-focus-within:flex p-1
        "
          >
            {loading ? (
              <div className="bg-gray-100 pt-[0.10rem] pb-[0.10rem] text-center">
                <p className="italic text-gray-400">Searching...</p>
              </div>
            ) : // If error during search
            error ? (
              <div className="bg-gray-100 pt-[0.10rem] pb-[0.10rem] text-center">
                <p className="italic text-gray-400">
                  An error happened, please try again
                </p>
              </div>
            ) : // If there are results, display them
            searchResults[0] ? (
              searchResults.map((user, id) => (
                <Link
                  key={id}
                  to={`/profile/${user._id}`}
                  onClick={clearInput}
                  className="hover:bg-gray-100 pt-[0.10rem] pb-[0.10rem] pl-1"
                >
                  <img
                    className="w-9 h-9 mr-3 md:mr-3 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full object-cover
              inline"
                    src={
                      user &&
                      `https://faithhub-backend.fly.dev/${user.profile_picture}`
                    }
                  />
                  <p className="inline font-bold">
                    {user.first_name} {user.last_name}
                  </p>
                </Link>
              ))
            ) : (
              // If no results from search
              <div className="bg-gray-100 pt-[0.10rem] pb-[0.10rem] text-center">
                <p className="italic text-gray-400">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Transition>
  );
};

SearchBar.propTypes = {
  setSearchVisible: PropTypes.func,
  searchVisible: PropTypes.bool,
};

export default SearchBar;
