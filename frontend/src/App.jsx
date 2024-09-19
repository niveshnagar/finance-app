import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import { RecoilRoot } from "recoil";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoutes />}>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/sendmoney" element={<SendMoney />}></Route>
            </Route>

            <Route path="/signin" element={<Signin />}></Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
