import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify"; 

export default function PostCard({
  id,
  title,
  content,
  image,
  authorName,
  currentUsername,
  onDelete,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [favorited, setFavorited] = React.useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
  handleMenuClose();
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to delete posts");
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Deleted successfully!");
    if (onDelete) onDelete(id); 
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete the post");
  }
};


  const toggleFavorite = () => {
    setFavorited((prev) => !prev);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1565C0" }} aria-label="author-avatar">
            {authorName ? authorName[0].toUpperCase() : "A"}
          </Avatar>
        }
        action={
          currentUsername === authorName && (
            <>
              <IconButton
                aria-label="settings"
                aria-controls={open ? "post-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={title}
        subheader={authorName}
      />
      <CardMedia
        component="img"
        height="194"
        image={image || "/default-image.jpg"}
        alt={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: "flex-end" }}>
        <IconButton
          aria-label="add to favorites"
          onClick={toggleFavorite}
          sx={{ color: favorited ? red[700] : "gray" }}
        >
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
