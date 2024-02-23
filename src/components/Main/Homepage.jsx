import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";
import NewPost from "./NewPost";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Homepage = () => {
  const [navVisible, isSmallDevice] = useOutletContext();
  const [allPosts, setAllPosts] = useState([]);

  const auth = useSelector(state => state.auth)
  const { user } = auth

  return (
    <div
      className={`bg-gray-100 w-screen min-h-screen pt-[0.5rem]
        ${navVisible && isSmallDevice ? "brightness-75 blur-sm" : null}`}
    >
      <div className="flex justify-center pt-20 ml-[35%]">
    <Link to={`/profile/${user._id}/settings/preferences`}>
    <FontAwesomeIcon
                      icon={faGear}
                      className="w-4 h-4 pr-2"
                    />
    Feed preferences
    </Link>
    </div>
      <NewPost 
      setAllPosts={setAllPosts}
      />
      <Posts 
      allPosts={allPosts} 
      setAllPosts={setAllPosts}/>
    </div>
    
  );
};

export default Homepage;
