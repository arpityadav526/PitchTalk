import API from "./api";

export const getAllPosts = async (params = {}) => {
  const response = await API.get("/posts", { params });
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await API.get(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await API.put(`/posts/${postId}/like`);
  return response.data;
};

export const addCommentToPost = async ({ postId, text }) => {
  const response = await API.post(`/posts/${postId}/comment`, { text });
  return response.data;
};

export const createPost = async (formData) => {
  const response = await API.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};