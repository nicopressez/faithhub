import { useState } from "react"
import { Link } from "react-router-dom"

const SearchBar = () => {

    const [searchResults, setSearchResults] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSearch = async(e) => {
        const query = e.target.value
        setSearchInput(query)
        try  {
          if (query.length > 3)
         { 
          setLoading(true)
          const response = await fetch(`https://faithhub-backend.fly.dev/profile/searchbar?query=${query}`)
          const result = await response.json()
          setSearchResults(result.data)
          setTimeout(() => {
            setLoading(false)
          }, 200);
        }
        } catch (err) {
          // TODO: Add error handling
          console.log(err)
        }
      }
    return (
    <div className="relative group font-Rubik">
        <form>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search... "
            className="
            bg-gray-100 hidden lg:flex lg:w-auto p-1 lg:pl-3 pr-3 lg:pr-10 ml-3 lg:ml-8 rounded-large"
          ></input>
        </form>
        {searchResults && searchInput.length > 3 &&
         <div className="w-64 absolute top-10 left-8 bg-white border-2 rounded-lg flex-col
        w-98 hidden group-focus-within:flex p-1
        ">
            {loading ? 
            <div
            className="bg-gray-100 pt-[0.10rem] pb-[0.10rem] text-center">
              <p className="italic text-gray-400">
                Searching...</p>
            </div>
            : // If results, display them
            searchResults[0] ?
             searchResults.map((user, id) => (
                <Link key={id}
                to={`/profile/${user._id}`}
                className="hover:bg-gray-100 pt-[0.10rem] pb-[0.10rem] pl-1">
                    <img
              className="w-9 h-9 mr-3 md:mr-3 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full object-cover
              inline"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
            <p className="inline font-bold">{user.first_name} {user.last_name}</p>
            </Link>
            )
            )
          : // If no results from search
          <div
            className="bg-gray-100 pt-[0.10rem] pb-[0.10rem] text-center">
              <p className="italic text-gray-400">
                No results found
                </p>
            </div>
          }

        </div>
}
        </div>
    )
};

export default SearchBar