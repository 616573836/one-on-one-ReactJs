
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign_up";
import Login from "./components/login";

// Other imports...

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="signup/" element={<SignUp />} />
        <Route path="login/" element={<Login />} />


          {/* Other routes */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
