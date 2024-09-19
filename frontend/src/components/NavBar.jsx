import React from "react";
import userImage from "../assets/images/user.png";
import { useRecoilValue } from "recoil";
import userAtom from "../store/atoms/user.atom";

const NavBar = () => {
  const loggedinUser = useRecoilValue(userAtom);
  console.log("loggedinUser: ", loggedinUser);

  return (
    <div className="flex justify-between items-center bg-slate-400 py-4 px-16 ">
      <div className="text-3xl font-medium font-serif">
        Piggy Bank Financing
      </div>
      <div className="flex items-center">
        <div className="text-3xl font-medium pr-4">
          {loggedinUser &&
            `${loggedinUser[0].toUpperCase()}${loggedinUser
              .slice(1)
              .toLowerCase()}`}
        </div>
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
