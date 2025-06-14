import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Fab,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

import PostCard from "../components/PostCard";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/");
        const users = res.data;

        const allPosts = users.flatMap((user) =>
          user.posts.map((post) => ({
            ...post,
            authorName: user.username,
          }))
        );

        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setCurrentUsername(decodedPayload.username);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    handleMenuClose();
    window.location.reload();
  };

  const handleDeletePost = (deletedId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedId));
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          Our Blog
        </Typography>

        {isLoggedIn ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleMenuOpen}
            >
              <Avatar src="person.jpg" alt={currentUsername} />
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, fontWeight: "medium", color: "text.primary" }}
              >
                {currentUsername}
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button href="/login" variant="text" sx={{ mr: 1 }}>
              Login
            </Button>
            <Button href="/signup" variant="outlined">
              Sign Up
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          py: 4,
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Our Blog
        </Typography>
        <Typography variant="h6">
          Discover the latest posts, recipes, and creative ideas.
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {posts.length === 0 ? (
          <Box textAlign="center" mt={8}>
            <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="250"
    height="250"
    viewBox="0 0 512 512"
  >
    <defs>
      <linearGradient id="a" x1="107.83" x2="395" y1="312.8" y2="312.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#a9afc4" />
        <stop offset="1" stopColor="#d4d8e5" />
      </linearGradient>
      <linearGradient id="b" x1="321.03" x2="395" y1="262.61" y2="262.61" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#cacfdd" />
        <stop offset="1" stopColor="#eef0f1" />
      </linearGradient>
    </defs>
    <g>
      <g data-name="Folder Empty">
        <path
          fill="#5E6175"
          d="M127.55 181.16a23.49 23.49 0 0 1-19-27.21 17.5 17.5 0 0 0-14.15-20.37c-12.72-2.6-21.22-14.83-19-27.28l5.91 1c-1.64 9.27 4.74 18.4 14.23 20.34a23.48 23.48 0 0 1 18.94 27.2 17.51 17.51 0 0 0 14.15 20.36zM183.81 178.23a33.76 33.76 0 0 1-1.68-47.74c10-10.28 10.36-28.34-1.37-39.28-13.32-13-14-34.46-1.67-47.76l4.39 4.08c-10.18 10.95-9.54 28.6 1.43 39.34 14.12 13.17 13.82 35.18 1.55 47.77a27.77 27.77 0 0 0 1.44 39.2zM244.48 207.84a39.36 39.36 0 0 1 9.46-54.84 33.41 33.41 0 0 0 8-46.52l4.91-3.45a39.41 39.41 0 0 1-9.47 54.86 33.35 33.35 0 0 0-8 46.52z"
        />
        <path
          fill="url(#a)"
          d="m394.75 254.09-22.19 148.47a31.81 31.81 0 0 1-31.46 27.12h-1.59a18.79 18.79 0 0 0 18.39-22.58l-27.37-132.5a22.62 22.62 0 0 0-22.14-18H148.66l-13.35-22A22.61 22.61 0 0 0 116 223.73h-7.54a22.6 22.6 0 0 1 22-27.81h38.23a22.63 22.63 0 0 1 19.12 10.54l13.68 21.69h170.9a22.61 22.61 0 0 1 22.36 25.94z"
        />
        <path
          fill="url(#b)"
          d="m394.75 254.09-6.43 43A86.65 86.65 0 0 1 321 228.15h51.36a22.61 22.61 0 0 1 22.39 25.94z"
        />
        <path
          fill="#DEE1EC"
          d="M339.51 429.68H101.35a22.6 22.6 0 0 1-22.13-18L46 250.91a22.61 22.61 0 0 1 22.14-27.18H116a22.61 22.61 0 0 1 19.32 10.86l13.35 22h159.72a22.62 22.62 0 0 1 22.14 18L357.9 407.1a18.79 18.79 0 0 1-18.39 22.58z"
        />
        <circle cx="406.04" cy="212.47" r="69.96" fill="#F5F5F5" />
        <path
          fill="#2575fc"
          d="M406 285.43a73 73 0 1 1 73-73 73 73 0 0 1-73 73zm0-139.91a67 67 0 1 0 67 66.95 67 67 0 0 0-67-66.95zM316.66 149.05a9.62 9.62 0 1 1 9.62-9.62 9.62 9.62 0 0 1-9.62 9.62zm0-13.23a3.62 3.62 0 1 0 3.62 3.61 3.61 3.61 0 0 0-3.62-3.61zM361.75 125.5A13.21 13.21 0 1 1 375 112.29a13.22 13.22 0 0 1-13.25 13.21zm0-20.41a7.21 7.21 0 1 0 7.21 7.2 7.21 7.21 0 0 0-7.21-7.2zM413.77 229.15h-15.45A33 33 0 0 1 412 202.41a10.27 10.27 0 1 0-16.26-8.35h-15.41A25.71 25.71 0 1 1 421.05 215a17.52 17.52 0 0 0-7.28 14.15zM398.15 241.09h15.51v15.51h-15.51z"
        />
      </g>
    </g>
  </svg>
            <Typography variant="h6" color="textSecondary">
              No posts available yet. Be the first to create one!
            </Typography>
            {isLoggedIn && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => (window.location.href = "/create-post")}
              >
                Create Post
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Box height="100%" display="flex">
                  <PostCard
                    id={post._id}
                    title={post.title}
                    content={post.content}
                    image={post.image}
                    authorName={post.authorName}
                    currentUsername={currentUsername}
                    onDelete={handleDeletePost}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {isLoggedIn && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
          }}
          onClick={() => {
            window.location.href = "/create-post";
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}
