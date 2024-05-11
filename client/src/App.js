import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "./components/pages/home";
import Dash from "./components/pages/Dashboard/Dashboard";
import Production from "./components/pages/prod";
import Collab from "./components/pages/collab";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
           {/* <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route> */}
          
          <Route path="/" element={<Home/>}></Route>
          <Route path="/collab" element={<Collab/>}></Route>
          <Route path="/dash" element={<Dash/>}></Route>
          <Route path="/prod" element={<Production/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;