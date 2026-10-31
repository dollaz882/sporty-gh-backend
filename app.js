const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let bets = [];
let deposits = [];
const ADMIN_MOMO = "0541378002"; // YOUR REAL MOMO - Benjamin

// FUNCTION TO GENERATE ALL MARKETS LIKE SPORTYBET
const r = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

function genAllMarkets() {
  return {
    // 1X2
    home: r(1.5, 3.5),
    draw: r(2.8, 4.2),
    away: r(2.0, 4.5),
    // Double Chance
    doubleChance: {
      "1X": r(1.15, 1.65),
      "X2": r(1.25, 1.85),
      "12": r(1.20, 1.45)
    },
    // Over/Under - 1.5, 2.5, 3.5
    overUnder: {
      "Over 1.5": r(1.18, 1.35),
      "Under 1.5": r(3.0, 5.0),
      "Over 2.5": r(1.65, 2.30),
      "Under 2.5": r(1.55, 2.10),
      "Over 3.5": r(2.40, 3.80),
      "Under 3.5": r(1.25, 1.50)
    },
    // Handicap
    handicap: {
      "Home -1": r(2.10, 3.50),
      "Away +1": r(1.50, 2.20),
      "Home -2": r(3.50, 6.00)
    },
    // Correct Score
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
}

function genStats() {
  return {
    form: "W-W-D-L-W",
    position: Math.floor(Math.random()*10)+1,
    goals: `${Math.floor(Math.random()*10)+5} scored`,
    headToHead: "Last 5: Home 2 wins, Away 1 win, 2 draws"
  };
}

// ALL MATCHES - WITH MORE LEAGUES + ALL MARKETS
let matches = [
  { id: 1, home: "Hearts of Oak", away: "Asante Kotoko", league: "Ghana Premier League", country: "Ghana", time: "15:00", odds: genAllMarkets(), stats: genStats(), table: { homePos: 2, awayPos: 1 } },
  { id: 2, home: "Man City", away: "Arsenal", league: "Premier League", country: "England", time: "17:30", odds: genAllMarkets(), stats: genStats(), table: { homePos: 1, awayPos: 3 } },
  { id: 3, home: "Barcelona", away: "Real Madrid", league: "La Liga", country: "Spain", time: "20:00", odds: genAllMarkets(), stats: genStats(), table: { homePos: 2, awayPos: 1 } },
  { id: 4, home: "Bayern", away: "Dortmund", league: "Bundesliga", country: "Germany", time: "18:30", odds: genAllMarkets(), stats: genStats(), table: { homePos: 1, awayPos: 4 } },
  { id: 5, home: "Inter", away: "AC Milan", league: "Serie A", country: "Italy", time: "19:45", odds: genAllMarkets(), stats: genStats(), table: { homePos: 2, awayPos: 3 } },
  { id: 6, home: "PSG", away: "Marseille", league: "Ligue 1", country: "France", time: "20:00", odds: genAllMarkets(), stats: genStats(), table: { homePos: 1, awayPos: 2 } },
  { id: 7, home: "Al Ahly", away: "Zamalek", league: "Egypt Premier", country: "Egypt", time: "18:00", odds: genAllMarkets(), stats: genStats(), table: { homePos: 1, awayPos: 2 } },
  { id: 8, home: "Sundowns", away: "Kaizer Chiefs", league: "PSL", country: "South Africa", time: "16:00", odds: genAllMarkets(), stats: genStats(), table: { homePos: 1, awayPos: 5 } },
];

// ROUTES
app.get('/', (req, res) => res.send(`Sporty GH LIVE! MoMo: ${ADMIN_MOMO} - All Markets Ready!`));

app.get('/api/matches', (req, res) => res.json(matches));

// AUTO-ADD TOMORROW'S GAMES - This is what you asked for!
app.get('/api/matches/tomorrow', (req, res) => {
  const tomorrow = [
    { id: Date.now()+1, home: "Chelsea", away: "Liverpool", league: "Premier League", country: "England", time: "16:00", odds: genAllMarkets(), stats: genStats(), date: "TOMORROW" },
    { id: Date.now()+2, home: "Kotoko", away: "Hearts", league: "Ghana Premier League", country: "Ghana", time: "15:00", odds: genAllMarkets(), stats: genStats(), date: "TOMORROW" },
    { id: Date.now()+3, home: "Juventus", away: "Napoli", league: "Serie A", country: "Italy", time: "19:00", odds: genAllMarkets(), stats: genStats(), date: "TOMORROW" },
  ];
  matches.push(...tomorrow);
  res.json({ message: `Added ${tomorrow.length} matches for tomorrow`, matches: tomorrow, allMatches: matches });
});

// TEAMS TABLE + LEAGUES TABLE
app.get('/api/table/:league', (req, res) => {
  const league = req.params.league;
  const table = [
    { pos: 1, team: "Team A", P: 10, W: 7, D: 2, L: 1, GD: "+12", Pts: 23 },
    { pos: 2, team: "Team B", P: 10, W: 6, D: 3, L: 1, GD: "+8", Pts: 21 },
    { pos: 3, team: "Team C", P: 10, W: 5, D: 2, L: 3, GD: "+3", Pts: 17 },
  ];
  res.json({ league, table });
});

app.get('/api/leagues', (req, res) => {
  const leagues = [...new Set(matches.map(m => m.league))];
  res.json(leagues);
});

// Keep your old routes for users/bets/deposits here...
app.post('/api/register', (req, res) => { users.push(req.body); res.json({ success: true }); });
app.post('/api/bet', (req, res) => { bets.push(req.body); res.json({ success: true }); });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Live on ${PORT}`));
