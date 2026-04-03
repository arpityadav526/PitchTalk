import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, toggleFavoriteClub, toggleFavoritePlayer } from "../Services/userService";
import { useAuth } from "../context/AuthContext";
import { extractObject } from "../utils/extractors";
import "./Clubs.css";

const CLUBS = [
  "Real Madrid",
  "Barcelona",
  "Manchester City",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Bayern Munich",
  "Juventus",
  "PSG",
  "Borussia Dortmund",
];

const PLAYERS = [
  "Kylian Mbappe",
  "Erling Haaland",
  "Jude Bellingham",
  "Vinicius Jr",
  "Bukayo Saka",
  "Mohamed Salah",
  "Kevin De Bruyne",
  "Harry Kane",
];

const Clubs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => getUserProfile("me"),
    enabled: !!user,
  });

  const profile = useMemo(() => extractObject(data, ["user", "profile"]), [data]);
  const favoriteClubs = profile?.favoriteClubs || [];
  const favoritePlayers = profile?.favoritePlayers || [];

  const clubMutation = useMutation({
    mutationFn: toggleFavoriteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });

  const playerMutation = useMutation({
    mutationFn: toggleFavoritePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });

  return (
    <div className="clubs-page">
      <section className="clubs-card">
        <h1>Favorite Clubs</h1>
        <p>Pick the clubs you want to follow.</p>

        <div className="clubs-grid">
          {CLUBS.map((club) => {
            const active = favoriteClubs.includes(club);

            return (
              <button
                key={club}
                className={`club-chip ${active ? "active-chip" : ""}`}
                onClick={() => clubMutation.mutate(club)}
                disabled={!user}
              >
                {club}
              </button>
            );
          })}
        </div>
      </section>

      <section className="clubs-card">
        <h2>Favorite Players</h2>
        <p>Build your player watchlist.</p>

        <div className="clubs-grid">
          {PLAYERS.map((player) => {
            const active = favoritePlayers.includes(player);

            return (
              <button
                key={player}
                className={`club-chip ${active ? "active-chip" : ""}`}
                onClick={() => playerMutation.mutate(player)}
                disabled={!user}
              >
                {player}
              </button>
            );
          })}
        </div>

        {!user && (
          <p className="clubs-note">Login to save favorite clubs and players.</p>
        )}
      </section>
    </div>
  );
};

export default Clubs;