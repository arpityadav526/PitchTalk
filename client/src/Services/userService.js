import API from "./api";

export const getUserProfile = async (userId) => {
  if (!userId || userId === "me") {
    const response = await API.get("/users/profile");
    return response.data;
  }

  const response = await API.get(`/users/profile/${userId}`);
  return response.data;
};

export const toggleFavoriteClub = async (clubName) => {
  const response = await API.put("/users/favorite-clubs", { club: clubName });
  return response.data;
};

export const toggleFavoritePlayer = async (playerName) => {
  const response = await API.put("/users/favorite-players", { player: playerName });
  return response.data;
};