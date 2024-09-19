import { atom } from "recoil";

const userAtom = atom({
  key: "loggedinuser",
  default: null,
});

export default userAtom