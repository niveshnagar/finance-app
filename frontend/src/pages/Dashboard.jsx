import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import NavBar from "../components/NavBar";

const Dashboard = () => {
  const [username, setUsername] = useState("SubaRashi");
  const [firstName, setFirstName] = useState("Rashi");
  const [lastName, setLastName] = useState("Singh");
  const [balance, setBalance] = useState(100000);
  const [users, setUsers] = useState([]);
  const inputFilter = useRef();

  const getUserInfo = async () => {
    const filterQuery = inputFilter.current.value;
    const authToken = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/api/v1/user/list", {
      params: {
        filter: filterQuery,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Users: ", response?.data?.users);
    setUsers(response?.data?.users);
  };

  return (
    <div className="bg-slate-200 h-screen">
      <NavBar user={"Rashi"} />
      <div className="flex flex-col text-xl font-medium px-4 text-black">
        <p className="text-2xl font-bold">Account Info: </p>
        <div className=" ">
          <p>UserId: {username}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Balance: {balance}</p>
        </div>
      </div>
      <div className=" bg-slate-400 px-4 py-4">
        <input
          className="px-2 py-2 w-96"
          placeholder="Search users..."
          ref={inputFilter}
        />
        <button
          className="rounded bg-gray-800 text-white px-4 py-2 ml-4"
          onClick={getUserInfo}
        >
          Search
        </button>
      </div>
      {users.length ? (
        <ul className="flex flex-col gap-4 my-4">
          {users.map(({ firstName, userId }) => (
            <li className="flex justify-between px-10" key={firstName}>
              <p className="font-medium">{firstName}</p>
              <Link
                className="rounded bg-gray-800 text-white px-4 py-2"
                to={`/sendmoney?id=${userId}`}
              >
                Send Money
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Dashboard;
