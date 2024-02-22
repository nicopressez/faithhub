import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";
import NewPost from "./NewPost";

const Homepage = () => {
  const [navVisible, isSmallDevice] = useOutletContext();

  return (
    <div
      className={`bg-gray-100 w-screen min-h-screen pt-[0.5rem]
        ${navVisible && isSmallDevice ? "brightness-75 blur-sm" : null}`}
    >
      <NewPost />
      <Posts />
    </div>
  );
};

export default Homepage;
