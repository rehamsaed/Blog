import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostCard from './components/PostCard';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>

    
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
