const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let bets = [];

const matches = [
  { id: 1, home: "Hearts of Oak", away: "Asante Kotoko", odd1: "2.40", oddX: "2.90", odd2: "2.80", league: "Ghana Premier", time: "Today 15:00" },
  { id: 2, home: "Man City", away: "Arsenal", odd1: "1.90", oddX: "3.40", odd2: "4.00", league: "Premier League", time: "Today 17:30" },
  { id: 3, home: "Barcelona", away: "Real Madrid", odd1: "2.50", oddX: "3.20", odd2: "2.60", league: "La Liga", time: "Today 20:00" }
];

app.get('/', (req, res) => {
  res.send('SPORTY GH BACKEND LIVE!');
});

app.get('/api/games', (req, res) => {
  res.json(matches);
});

app.get('/api/matches', (req, res) => {
  res.json(matches);
});

app.post('/api/register', (req, res) => {
  const { phone, password } = req.body;
  users.push({ phone, password, balance: 0 });
  res.json({ msg: "Registered!", success: true });
});

app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone);
  if(user){
    res.json({ msg: "Logged in!", user, token: "fake-token" });
  } else {
    res.json({ msg: "Not found, please register" });
  }
});

// MAIN BETTING ENDPOINT - HOW PEOPLE BET!
app.post('/api/place-bet', (req, res) => {
  const { game, selection, odd, stake } = req.body;
  if(!stake || stake <= 0){
    return res.json({ success: false, msg: "Invalid stake" });
  }
  const potentialWin = parseFloat(stake) * parseFloat(odd);
  const newBet = {
    id: bets.length + 1,
    game,
    selection,
    odd,
    stake,
    potentialWin: potentialWin.toFixed(2),
    status: "pending",
    time: new Date().toLocaleString()
  };
  bets.push(newBet);
  res.json({ success: true, msg: "Bet placed!", bet: newBet });
});

app.get('/api/bets', (req, res) => {
  res.json(bets);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
