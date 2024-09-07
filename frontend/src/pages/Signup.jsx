import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Heading from "../components/Heading";
import Subheading from "../components/Subheading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signup",
      { firstName, lastName, username, password }
    );
    if (response.data.message === "User registered successfully") {
      navigate("/signin");
    }
  };

  return (
    <div className="bg-zinc-400 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <Subheading text={"Enter your information to create an account"} />
          <InputBox
            label={"First Name"}
            placeholder={"John"}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <InputBox
            label={"Last Name"}
            placeholder={"Doe"}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <InputBox
            label={"Email"}
            placeholder={"johndoe@example.com"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <InputBox
            label={"Password"}
            placeholder={"password"}
            inputType={"password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button label={"Sign up"} onClick={handleSubmit} />
          </div>
          <BottomWarning
            text={"Already have an account?"}
            buttonText={"Sign-in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
