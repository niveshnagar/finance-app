import React from "react";
import userImage from "../assets/images/user.png";

const NavBar = ({ user }) => {
  return (
    <div className="flex justify-between items-center bg-slate-400 py-4 px-16 ">
      <div className="text-3xl font-medium font-serif">Elfo's</div>
      <div className="flex items-center">
        <div className="text-3xl font-medium pr-4">{user}</div>
        <div>
          <img
            className="w-10 h-10 rounded-full cursor-pointer  "
            src={userImage}
            alt="Rounded avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
