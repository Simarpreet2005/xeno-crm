import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import AIStudio from "./pages/AIStudio";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/ai" element={<AIStudio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;