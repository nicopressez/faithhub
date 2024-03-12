import { useState } from "react"
import { Link } from "react-router-dom"

const SearchBar = () => {

    const [searchResults, setSearchResults] = useState([])

    const handleSearch = async(e) => {
        const query = e.target.value
        try  {
          if (query.length > 3)
         { 
          const response = await fetch(`https://faithhub-backend.fly.dev/profile/searchbar?query=${query}`)
          const result = await response.json()
          console.log(result)
          setSearchResults(result.data)
        }
        } catch (err) {
          // TODO: Add error handling
          console.log(err)
        }
      }
    return (
    <div className="relative">
        <form>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search... "
            className="
            bg-gray-100 hidden lg:flex lg:w-auto p-1 lg:pl-3 pr-3 lg:pr-10 ml-3 lg:ml-8 rounded-large"
          ></input>
        </form>
        <div className="absolute top-10 left-12 bg-white border-2 rounded-lg flex flex-col
        w-60
        ">
            {searchResults && searchResults.map((user, id) => (
                <Link key={id}
                to={`/profile/${user._id}`}
                className="hover:bg-gray-100 pt-[0.10rem] pb-[0.10rem]">
                    <img
              className="w-9 h-9 mr-2 md:mr-2 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full object-cover
              inline"
              src={
                user &&
                `https://faithhub-backend.fly.dev/${user.profile_picture}`
              }
            />
            <p className="inline">{user.first_name} {user.last_name}</p>
            </Link>
            )

            )}

        </div>
        </div>
    )
};

export default SearchBar