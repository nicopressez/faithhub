import { useOutletContext } from "react-router-dom";
import Posts from "./Posts";

const Homepage = () => {
  const [navVisible, isSmallDevice] = useOutletContext();

  return (
    <div
      className={`bg-gray-100 w-screen h-screen pt-[0.5rem]
        ${navVisible && isSmallDevice ? "brightness-75 blur-sm" : null}`}
    >
      <Posts />
    </div>
  );
};

export default Homepage;
