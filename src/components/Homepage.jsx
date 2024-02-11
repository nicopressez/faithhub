import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Homepage = () => {
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const { isLoggedIn } = auth;

  // Not logged in, redirect to auth page
  // TODO: Add token check to assign if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  return <div className="bg-gray-100 w-screen h-screen">homepage</div>;
};

export default Homepage;
