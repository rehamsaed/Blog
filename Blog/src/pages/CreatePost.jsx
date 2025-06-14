import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };

    if (name === "title") {
      if (!value) {
        errors.title = "Title is required";
      } else if (value.length < 3) {
        errors.title = "Title must be at least 3 characters";
      } else {
        delete errors.title;
      }
    }

    if (name === "content") {
      if (!value) {
        errors.content = "Content is required";
      } else if (value.length < 10) {
        errors.content = "Content must be at least 10 characters";
      } else {
        delete errors.content;
      }
    }

    setFieldErrors(errors);
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      setFieldErrors({}); 

      const response = await axios.post(
        "http://localhost:5000/api/posts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setPreview(null);

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error("Error creating post:", err);

      if (err.response?.data?.errors) {
        const errorMap = {};
        err.response.data.errors.forEach((e) => {
          if (e.path && e.path[0]) {
            errorMap[e.path[0]] = e.message;
          }
        });
        setFieldErrors(errorMap);
      } else if (err.response?.data?.message) {
        setFieldErrors({ general: err.response.data.message });
      } else {
        setFieldErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Create a New Post
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {fieldErrors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fieldErrors.general}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validateField("title", e.target.value);
            }}
            margin="normal"
          
            error={Boolean(fieldErrors.title)}
            helperText={fieldErrors.title}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              validateField("content", e.target.value);
            }}
            margin="normal"
            
            error={Boolean(fieldErrors.content)}
            helperText={fieldErrors.content}
          />

          {preview && (
            <Box mt={3} textAlign="center">
              <Typography variant="subtitle1" mb={1}>
                Image Preview:
              </Typography>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
              />
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 3 }}
            fullWidth
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Button variant="contained" type="submit" fullWidth>
            Submit Post
          </Button>
        </form>
      </Box>
    </Container>
  );
}
