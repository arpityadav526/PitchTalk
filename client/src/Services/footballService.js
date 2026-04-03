import API from "./api";

export const getUpcomingFixtures = async () => {
  const response = await API.get("/football/fixtures");
  return response.data;
};

export const getLeagueStandings = async () => {
  const response = await API.get("/football/standings");
  return response.data;
};

export const getLeagues = async () => {
  const response = await API.get("/football/leagues");
  return response.data;
};