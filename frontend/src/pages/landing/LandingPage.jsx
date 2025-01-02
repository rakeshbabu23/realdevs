import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/landingpage/Navbar";
import Typewriter from "../../components/acernityUI/TypeWriter";
import Button from "../../components/general/Button";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="relative bg-black min-h-screen p-4">
      <Navbar />
      <div className="bg-black  w-[100%] flex flex-row justify-center items-center ">
        <Typewriter />
      </div>
      <div className="absolute w-[95%] text-center opacity-80 flex flex-col justify-center items-center">
        <h4 className="text-purple-600 text-5xl md:text-5xl ld:text-6xl font-jost">
          Showcase Your portfolio,projects.
        </h4>
        <h4 className="text-purple-600 text-5xl md:text-5xl ld:text-6xl font-jost mb-4">
          Discover talent
        </h4>
        <Button text="Get Started" styles="w-32" action={handleLogin} />
      </div>
    </div>
  );
};

export default LandingPage;
