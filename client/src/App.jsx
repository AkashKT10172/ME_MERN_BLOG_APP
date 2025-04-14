// CRIO_SOLUTION_START_MODULE_ONE
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from './pages/CreatePost';
import EditPost from "./pages/EditPost";
import PostView from "./pages/PostView";
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element= { <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/create" element= { <ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
        <Route path="/edit/:id" element= { <ProtectedRoute> <EditPost /> </ProtectedRoute>} />
        <Route path="/profile" element= { <ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/posts/:id" element={<PostView />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

// CRIO_SOLUTION_END_MODULE_ONE