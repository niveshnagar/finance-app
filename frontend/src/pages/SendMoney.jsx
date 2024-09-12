import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import Heading from "../components/Heading";

const SendMoney = () => {
  const [userInfo, setUserInfo] = useState();
  const [amount, setAmount] = useState();

  const [params] = useSearchParams();

  const receiverId = params.get("id");
  const authToken = localStorage.getItem("token");

  const handleTransfer = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/v1/account/transfer",
      {
        receiverId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("response: ", response);
    console.log("transfer complete");
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/userId",
        {
          params: {
            id: receiverId,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUserInfo(response?.data?.user);
      console.log("response: ", response.data.user);
    };
    getUserInfo();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-slate-500">
      <div className="flex flex-col items-center bg-white rounded-xl w-96 px-4 py-8">
        <Heading label={"Send Money"} />
        <div className="flex w-full items-center justify-start space-x-4">
          <div className="rounded-full bg-green-600  w-12 h-12 flex justify-center items-center">
            <span className="text-white text-2xl">
              {userInfo?.firstName[0]?.toUpperCase()}
            </span>
          </div>
          <div className="text-2xl font-semibold">
            {userInfo?.firstName &&
              `${userInfo.firstName[0].toUpperCase()}${userInfo.firstName
                .slice(1)
                .toLowerCase()}`}
          </div>
        </div>

        <div className="w-full">
          <p className="text-left font-medium text-sm py-2">Amount (in Rs.)</p>
          <input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
            className="w-full border px-2 py-2 rounded border-slate-200"
          ></input>
        </div>

        <button
          onClick={handleTransfer}
          className="w-full text-white bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
