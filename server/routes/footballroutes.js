const express = require("express");
const router = express.Router();
const {
  getUpcomingFixtures,
  getLeagueStandings,
  getSupportedLeagues,
} = require("../controllers/footballController");

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Football route working",
  });
});

router.get("/leagues", getSupportedLeagues);
router.get("/fixtures", getUpcomingFixtures);
router.get("/standings", getLeagueStandings);

module.exports = router;