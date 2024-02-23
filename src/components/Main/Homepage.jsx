import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";
import NewPost from "./NewPost";
import { useState } from "react";
import { Transition } from "@headlessui/react";

const Homepage = () => {
  const [navVisible, isSmallDevice] = useOutletContext();
  const [allPosts, setAllPosts] = useState([]);

  return (
    <div
      className={`bg-gray-100 w-screen min-h-screen pt-[0.5rem]
        ${navVisible && isSmallDevice ? "brightness-75 blur-sm" : null}`}
    >
    
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
