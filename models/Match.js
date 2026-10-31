// Sporty GH - ALL MARKETS: Handicap, Over/Under 1.5,2.5,3.5, Correct Score, Double Chance, Stats, Table
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  homeTeam: String,
  awayTeam: String,
  league: String,
  country: String,
  date: String,
  time: String,
  status: { type: String, default: "upcoming" },
  
  // All odds - like SportyBet
  odds: {
    home: String,
    draw: String,
    away: String,
    doubleChance: {
      homeOrDraw: String, // 1X
      awayOrDraw: String,  // X2
      homeOrAway: String   // 12
    },
    overUnder: {
      over15: String,
      under15: String,
      over25: String,
      under25: String,
      over35: String,
      under35: String
    },
    handicap: {
      homeMinus1: String,
      awayPlus1: String,
      homeMinus2: String
    },
    correctScore: Object
  },
  
  // Team stats + table position
  stats: {
    homeForm: String,
    awayForm: String,
    homePosition: Number,
    awayPosition: Number,
    headToHead: String
  }
});

// Function to auto-generate realistic odds
MatchSchema.statics.generateOdds = function() {
  const r = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
  return {
    home: r(1.50, 3.20),
    draw: r(2.80, 4.00),
    away: r(2.00, 4.50),
    doubleChance: {
      homeOrDraw: r(1.15, 1.65),
      awayOrDraw: r(1.25, 1.85),
      homeOrAway: r(1.20, 1.45)
    },
    overUnder: {
      over15: r(1.18, 1.35),
      under15: r(3.00, 5.00),
      over25: r(1.65, 2.30),
      under25: r(1.55, 2.10),
      over35: r(2.40, 3.80),
      under35: r(1.25, 1.50)
    },
    handicap: {
      homeMinus1: r(2.10, 3.50),
      awayPlus1: r(1.50, 2.20),
      homeMinus2: r(3.50, 6.00)
    },
    correctScore: {
      "1-0": r(5.5, 7.5),
      "2-0": r(7.0, 9.5),
      "2-1": r(6.5, 8.5),
      "1-1": r(5.0, 7.0),
      "0-0": r(6.0, 9.0),
      "0-1": r(6.5, 9.0),
      "0-2": r(8.5, 12.0),
      "1-2": r(7.5, 10.0)
    }
  };
};

// Teams for auto-add tomorrow - MORE LEAGUES
MatchSchema.statics.tomorrowTeams = [
  { homeTeam: "Hearts of Oak", awayTeam: "Asante Kotoko", league: "Ghana Premier League", country: "Ghana" },
  { homeTeam: "Man City", awayTeam: "Arsenal", league: "Premier League", country: "England" },
  { homeTeam: "Barcelona", awayTeam: "Real Madrid", league: "La Liga", country: "Spain" },
  { homeTeam: "Bayern Munich", awayTeam: "Dortmund", league: "Bundesliga", country: "Germany" },
  { homeTeam: "Inter Milan", awayTeam: "AC Milan", league: "Serie A", country: "Italy" },
  { homeTeam: "PSG", awayTeam: "Marseille", league: "Ligue 1", country: "France" },
  { homeTeam: "Al Ahly", awayTeam: "Zamalek", league: "Egypt Premier", country: "Egypt" },
  { homeTeam: "Sundowns", awayTeam: "Kaizer Chiefs", league: "PSL", country: "South Africa" }
];

module.exports = mongoose.model('Match', MatchSchema);
