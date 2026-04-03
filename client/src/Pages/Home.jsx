import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, Trophy, Users, Newspaper } from "lucide-react";
import { getLeagueStandings, getUpcomingFixtures } from "../Services/footballService";
import { extractArray } from "../utils/extractors";
import Button from "../Components/ui/Button";
import "./Home.css";

const Home = () => {
  const fixturesQuery = useQuery({
    queryKey: ["fixtures"],
    queryFn: getUpcomingFixtures,
  });

  const standingsQuery = useQuery({
    queryKey: ["standings"],
    queryFn: getLeagueStandings,
  });

  const fixtures = useMemo(
    () => extractArray(fixturesQuery.data, ["fixtures", "events"]),
    [fixturesQuery.data]
  );

  const standings = useMemo(
    () => extractArray(standingsQuery.data, ["standings", "table"]),
    [standingsQuery.data]
  );

  return (
    <section className="home-page">
      <div className="hero-card">
        <div className="hero-badge">Football Fan Community</div>

        <h1 className="hero-title">
          Where football fans discuss matches, clubs, players, and everything in between.
        </h1>

        <p className="hero-subtitle">
          PitchTalk combines community discussion, match awareness, club following,
          and fan-generated content into one modern football platform.
        </p>

        <div className="hero-actions">
          <Link to="/feed">
            <Button>Explore Feed</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Create Account</Button>
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat-card">
            <MessageSquareText size={18} />
            <span>Live football discussions</span>
          </div>
          <div className="hero-stat-card">
            <Users size={18} />
            <span>Community-first posting</span>
          </div>
          <div className="hero-stat-card">
            <Trophy size={18} />
            <span>Club and player follows</span>
          </div>
          <div className="hero-stat-card">
            <Newspaper size={18} />
            <span>Fixtures and standings</span>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <section className="home-panel">
          <div className="panel-header">
            <h2>Upcoming Fixtures</h2>
            <span className="panel-tag">Live data</span>
          </div>

          {fixturesQuery.isLoading ? (
            <p className="soft-text">Loading fixtures...</p>
          ) : fixtures.length === 0 ? (
            <p className="soft-text">No fixtures available.</p>
          ) : (
            <div className="fixture-list">
              {fixtures.slice(0, 5).map((fixture, index) => (
                <div key={fixture.id || index} className="fixture-item">
                  <div>
                    <strong>
                      {fixture.homeTeam || fixture.strHomeTeam || "Home"} vs{" "}
                      {fixture.awayTeam || fixture.strAwayTeam || "Away"}
                    </strong>
                    <p className="soft-text">
                      {fixture.strLeague || fixture.league || "Competition"}
                    </p>
                  </div>
                  <span>{fixture.dateEvent || fixture.date || "Upcoming"}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="home-panel">
          <div className="panel-header">
            <h2>League Standings</h2>
            <span className="panel-tag">Top clubs</span>
          </div>

          {standingsQuery.isLoading ? (
            <p className="soft-text">Loading standings...</p>
          ) : standings.length === 0 ? (
            <p className="soft-text">No standings available.</p>
          ) : (
            <div className="standing-list">
              {standings.slice(0, 5).map((team, index) => (
                <div key={team.idTeam || index} className="standing-item">
                  <div className="standing-left">
                    <span className="standing-rank">
                      {team.rank || team.intRank || index + 1}
                    </span>
                    <strong>{team.name || team.strTeam || "Team"}</strong>
                  </div>
                  <span>{team.points || team.intPoints || 0} pts</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Home;