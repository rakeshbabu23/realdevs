import React from "react";
import Button from "../general/Button";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="flex flex-row justify-between items-center p-2  h-16 ">
      <p className="text-purple-600 font-jost  text-4xl">Realdevs</p>
      <div class="flex flex-row space-x-2 p-2 items-center">
        <Button text="Authenticate" action={handleLogin} />
      </div>
    </div>
  );
}

export default Navbar;
