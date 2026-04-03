import API from "./api";

export const getAdminPosts = async () => {
  const response = await API.get("/admin/posts");
  return response.data;
};

export const deleteAdminPost = async (postId) => {
  const response = await API.delete(`/admin/posts/${postId}`);
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await API.delete(`/admin/users/${userId}`);
  return response.data;
};