import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import Heading from "../components/Heading";
import Subheading from "../components/Subheading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

import userAtom from "../store/atoms/user.atom";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setLoggedinUser = useSetRecoilState(userAtom);

  // if the user has signed in, store his info in a global state;
  const getSignedinUser = async (authToken) => {
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
    const { username } = signedinUser;
    setLoggedinUser(username);
  };

  const handleSubmit = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signin",
      { username, password }
    );
    if (response.data?.token) {
      const authToken = response.data.token;
      localStorage.setItem("token", authToken);
      getSignedinUser(authToken);
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-zinc-400 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <Subheading text={"Enter your credentials to login."} />
          <InputBox
            label={"Username"}
            placeholder={"John"}
            onChange={(e) => {
              setUsername(e.target.value.trim());
            }}
          />
          <InputBox
            label={"Password"}
            placeholder={"12345678"}
            inputType={"password"}
            onChange={(e) => {
              setPassword(e.target.value.trim());
            }}
          />
          <div className="pt-4">
            <Button label={"Sign in"} onClick={handleSubmit} />
          </div>
          <BottomWarning
            text={"New user?"}
            buttonText={"Sign-up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
