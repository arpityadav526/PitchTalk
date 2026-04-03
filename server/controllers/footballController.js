const axios = require("axios");

const SPORTS_DB_BASE_URL = "https://www.thesportsdb.com/api/v1/json";
const SPORTS_DB_API_KEY = process.env.FOOTBALL_API_KEY || "123";

// Common football league IDs in TheSportsDB
const LEAGUE_IDS = {
  EPL: "4328",
  LaLiga: "4335",
  SerieA: "4332",
  Bundesliga: "4331",
  Ligue1: "4334",
  UCL: "4480",
};

const getLeagueId = (league) => {
  if (!league) return LEAGUE_IDS.EPL;
  return LEAGUE_IDS[league] || league;
};

// @desc    Get upcoming fixtures for a league
// @route   GET /api/football/fixtures?league=EPL
// @access  Public
const getUpcomingFixtures = async (req, res, next) => {
  try {
    const league = req.query.league || "EPL";
    const leagueId = getLeagueId(league);

    const url = `${SPORTS_DB_BASE_URL}/${SPORTS_DB_API_KEY}/eventsnextleague.php?id=${leagueId}`;

    const { data } = await axios.get(url);

    res.status(200).json({
      success: true,
      league,
      leagueId,
      count: data.events ? data.events.length : 0,
      fixtures: data.events || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get league standings
// @route   GET /api/football/standings?league=EPL&season=2024-2025
// @access  Public
const getLeagueStandings = async (req, res, next) => {
  try {
    const league = req.query.league || "EPL";
    const season = req.query.season;
    const leagueId = getLeagueId(league);

    let url = `${SPORTS_DB_BASE_URL}/${SPORTS_DB_API_KEY}/lookuptable.php?l=${leagueId}`;
    if (season) {
      url += `&s=${encodeURIComponent(season)}`;
    }

    const { data } = await axios.get(url);

    res.status(200).json({
      success: true,
      league,
      leagueId,
      season: season || "",
      count: data.table ? data.table.length : 0,
      standings: data.table || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get supported leagues for frontend dropdown
// @route   GET /api/football/leagues
// @access  Public
const getSupportedLeagues = async (req, res) => {
  res.status(200).json({
    success: true,
    leagues: [
      { key: "EPL", id: "4328", name: "English Premier League" },
      { key: "LaLiga", id: "4335", name: "Spanish La Liga" },
      { key: "SerieA", id: "4332", name: "Italian Serie A" },
      { key: "Bundesliga", id: "4331", name: "German Bundesliga" },
      { key: "Ligue1", id: "4334", name: "French Ligue 1" },
      { key: "UCL", id: "4480", name: "UEFA Champions League" },
    ],
  });
};

module.exports = {
  getUpcomingFixtures,
  getLeagueStandings,
  getSupportedLeagues,
};