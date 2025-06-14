import React, { useState } from "react";
import Joi from "joi";
import axios from "axios";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Link,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",

    "any.required": "Password is required",
  }),
});

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (fieldName, value) => {
    const obj = { ...form, [fieldName]: value };
    const result = schema.validate(obj, { abortEarly: false });

    if (!result.error) return "";

    const error = result.error.details.find(
      (detail) => detail.path[0] === fieldName
    );

    return error ? error.message : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validateField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateForm = () => {
    const result = schema.validate(form, { abortEarly: false });
    if (!result.error) {
      setErrors({});
      return true;
    }

    const validationErrors = {};
    result.error.details.forEach((detail) => {
      validationErrors[detail.path[0]] = detail.message;
    });
    setErrors(validationErrors);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f1f7fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          padding: 4,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#1565C0", fontWeight: "bold" }}
        >
          Login
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errors.password && (
              <Typography variant="caption" color="error">
                {errors.password}
              </Typography>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2, height: "50px" }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center">
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 600, fontSize: "18px" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
