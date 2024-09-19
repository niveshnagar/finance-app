import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import NavBar from "../components/NavBar";

const Dashboard = () => {
  // TODO -  replace with useReducer for cleaner code
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState("");
  const [balance, setBalance] = useState("");
  const [users, setUsers] = useState([]);
  const inputFilter = useRef();

  const authToken = localStorage.getItem("token");

  useEffect(() => {
    // Make a backend call to get following info about the user

    // TODO - firstname, lastname of logged in user
    const getSignedinUser = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/userinfo",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status !== 200) return;

      const signedinUser = response?.data?.user;
      const { firstName, lastName, username } = signedinUser;
      setFirstName(firstName);
      setLastName(lastName);
      setUsername(username);
    };
    getSignedinUser();

    // TODO - wallet balamce of the logged in user
    const getAccountBalance = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status !== 200) return;

      const balance = response?.data?.balance;
      setBalance(balance);
    };
    getAccountBalance();
  }, []);

  const getUsers = async () => {
    const filterQuery = inputFilter.current.value;
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
      <NavBar />
      <div className="flex flex-col text-xl font-medium px-4 text-black">
        <p className="text-2xl font-bold">Account Info: </p>
        <div className=" ">
          <p>UserId: {username}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Wallet Balance: &#8377; {(balance / 100).toFixed(2)}</p>
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
          onClick={getUsers}
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
