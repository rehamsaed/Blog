import React, { useState } from "react";
import Joi from "joi";
import axios from "axios";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
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
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 20 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
    "string.empty": "Please confirm your password",
  }),
});


const validatePasswordRules = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@$!%*?&)."
    );
  }

  return errors;
};

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (fieldName, value) => {
    const obj = { ...form, [fieldName]: value };
    const result = schema.validate(obj, { abortEarly: false });

    if (!result.error) return "";

    const error = result.error.details.find(
      (detail) => detail.path[0] === fieldName
    );

    return error ? error.message : "";
  };

  const validateForm = () => {
    const result = schema.validate(form, { abortEarly: false });
    let validationErrors = {};

    if (result.error) {
      result.error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
    }

    const passwordErrors = validatePasswordRules(form.password);
    if (passwordErrors.length > 0) {
      validationErrors.password = passwordErrors;
    }

    if (form.confirmPassword !== form.password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };

    if (name === "password") {
      const passErrors = validatePasswordRules(value);
      if (passErrors.length > 0) {
        newErrors.password = passErrors;
      } else {
        delete newErrors.password;
      }


      if (form.confirmPassword && form.confirmPassword !== value) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    } else if (name === "confirmPassword") {
      if (value !== form.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    } else {
      const errorMessage = validateField(name, value);
      if (errorMessage) {
        newErrors[name] = errorMessage;
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users/", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Account created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const validationErrors = {};
        err.response.data.errors.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response?.data?.message) {
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
          Create Account
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
          />

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
            {errors.password &&
              Array.isArray(errors.password) &&
              errors.password.map((msg, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  color="error"
                  display="block"
                >
                  {msg}
                </Typography>
              ))}
          </FormControl>

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
            {errors.confirmPassword && (
              <Typography variant="caption" color="error">
                {errors.confirmPassword}
              </Typography>
            )}
          </FormControl>

          <FormControlLabel control={<Checkbox />} label="Remember me" />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2, height: "50px" }}
          >
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 600, fontSize: "18px" }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;
