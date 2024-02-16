import { useOutletContext } from "react-router-dom";

const Homepage = () => {

  const [navVisible] = useOutletContext()

  return (
    <div className={`bg-gray-100 w-screen h-screen pt-[0.5rem]
        ${navVisible ? "brightness-75 blur-sm" : null}`}></div>
  )
};

export default Homepage;
