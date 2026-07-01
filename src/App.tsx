import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Frontpage from "./frontpage/FrontPage";

import "./App.css";

function PortfolioLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />

      <Route path="/*" element={<PortfolioLayout />} />
    </Routes>
  );
}

export default App;