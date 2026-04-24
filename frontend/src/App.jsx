import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Content from './pages/Content';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/content" element={<Content />} />
        
      </Routes>
    </Router>
  );
}

export default App;