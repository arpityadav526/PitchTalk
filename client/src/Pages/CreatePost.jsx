import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../Services/postService";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    club: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      const createdPostId = data?._id || data?.post?._id;
      navigate(createdPostId ? `/post/${createdPostId}` : "/feed");
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to create post.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("club", formData.club);

    if (imageFile) {
      payload.append("image", imageFile);
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <h1>Create a New Post</h1>
        <p>Share your football thoughts with the community.</p>

        {error && <div className="create-post-error">{error}</div>}

        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="create-post-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a strong post title"
              required
            />
          </div>

          <div className="create-post-group">
            <label htmlFor="club">Club / Topic</label>
            <input
              id="club"
              name="club"
              type="text"
              value={formData.club}
              onChange={handleChange}
              placeholder="e.g. Barcelona, Arsenal, UCL"
            />
          </div>

          <div className="create-post-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your football opinion here..."
              required
            />
          </div>

          <div className="create-post-group">
            <label htmlFor="image">Upload Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;