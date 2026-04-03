import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../Services/userService";
import { extractObject, extractArray } from "../utils/extractors";
import PostCard from "../components/posts/PostCard";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUserProfile(id),
  });

  const profile = useMemo(() => extractObject(data, ["user", "profile"]), [data]);
  const posts = useMemo(() => extractArray(data, ["posts", "userPosts"]), [data]);

  if (isLoading) {
    return <div className="profile-state">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="profile-state error-state">
        {error?.response?.data?.message || "Failed to load profile."}
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile?.name} />
            ) : (
              <span>{profile?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>

          <div>
            <h1>{profile?.name || "User"}</h1>
            <p>{profile?.email || "No email available"}</p>
            <p className="profile-role">Role: {profile?.role || "user"}</p>
          </div>
        </div>

        <div className="profile-favorites">
          <div>
            <h3>Favorite Clubs</h3>
            <div className="tag-wrap">
              {(profile?.favoriteClubs || []).length > 0 ? (
                profile.favoriteClubs.map((club) => (
                  <span key={club} className="tag">{club}</span>
                ))
              ) : (
                <span className="muted-text">No favorite clubs yet.</span>
              )}
            </div>
          </div>

          <div>
            <h3>Favorite Players</h3>
            <div className="tag-wrap">
              {(profile?.favoritePlayers || []).length > 0 ? (
                profile.favoritePlayers.map((player) => (
                  <span key={player} className="tag">{player}</span>
                ))
              ) : (
                <span className="muted-text">No favorite players yet.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="profile-posts-section">
        <div className="profile-posts-header">
          <h2>User Posts</h2>
          <Link to="/create" className="profile-create-link">Create New</Link>
        </div>

        <div className="profile-posts-list">
          {posts.length === 0 ? (
            <div className="profile-state">No posts yet.</div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} onLike={() => {}} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;