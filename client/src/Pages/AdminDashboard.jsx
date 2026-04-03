import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminPost,
  deleteAdminUser,
  getAdminPosts,
  getAdminUsers,
} from "../Services/adminService";
import { extractArray } from "../utils/extractors";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["admin-posts"],
    queryFn: getAdminPosts,
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  const posts = useMemo(
    () => extractArray(postsQuery.data, ["posts"]),
    [postsQuery.data]
  );

  const users = useMemo(
    () => extractArray(usersQuery.data, ["users"]),
    [usersQuery.data]
  );

  const deletePostMutation = useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return (
    <div className="admin-page">
      <section className="admin-card">
        <h1>Admin Dashboard</h1>
        <p>Manage platform posts and users.</p>
      </section>

      <section className="admin-card">
        <h2>Posts</h2>

        {postsQuery.isLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Club</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.author?.name || "Unknown"}</td>
                    <td>{post.club || "-"}</td>
                    <td>
                      <button
                        className="danger-btn"
                        onClick={() => deletePostMutation.mutate(post._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card">
        <h2>Users</h2>

        {usersQuery.isLoading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((person) => (
                  <tr key={person._id}>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                    <td>
                      <button
                        className="danger-btn"
                        onClick={() => deleteUserMutation.mutate(person._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;