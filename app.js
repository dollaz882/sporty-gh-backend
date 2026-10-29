const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = []; // {id, phone, password, balance}
let bets = [];
const matches = [
  { id: 1, home: "Hearts of Oak", away: "Asante Kotoko", odd1: "2.40", oddX: "2.90", odd2: "2.80", league: "Ghana Premier" },
  { id: 2, home: "Man City", away: "Arsenal", odd1: "1.90", oddX: "3.40", odd2: "4.00", league: "Premier League" },
  { id: 3, home: "Barcelona", away: "Real Madrid", odd1: "2.50", oddX: "3.80", odd2: "2.60", league: "La Liga" },
  { id: 4, home: "Kotoko", away: "Hearts", odd1: "2.10", oddX: "3.00", odd2: "3.20", league: "Ghana Premier" },
];

// Home
app.get('/', (req, res) => {
  res.send('Sporty GH Backend is LIVE! 🇬🇭🔥 API: /api/matches, /api/register, /api/login, /api/deposit');
});

// Get matches
app.get('/api/matches', (req, res) => {
  res.json(matches);
});

// REGISTER - with phone + password
app.post('/api/register', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: "Phone and password required" });
  if (users.find(u => u.phone === phone)) return res.status(400).json({ error: "User already exists" });
  const user = { id: users.length + 1, phone, password, balance: 0 };
  users.push(user);
  res.json({ message: "Registered!", user: { id: user.id, phone: user.phone, balance: user.balance } });
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.status(400).json({ error: "Wrong phone or password" });
  res.json({ message: "Login success", user: { id: user.id, phone: user.phone, balance: user.balance } });
});

// DEPOSIT - MTN MoMo Simulation (We will connect Paystack next)
app.post('/api/deposit', (req, res) => {
  const { phone, amount } = req.body;
  const user = users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ error: "User not found" });
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amount" });
  user.balance += amt;
  res.json({ message: `Deposited GHS ${amt} via MoMo!`, balance: user.balance });
});

// PLACE BET
app.post('/api/bet', (req, res) => {
  const { phone, matchId, odd, amount } = req.body;
  const user = users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ error: "Login first" });
  if (user.balance < amount) return res.status(400).json({ error: "Insufficient balance - Deposit via MoMo!" });
  user.balance -= amount;
  const bet = { id: bets.length + 1, phone, matchId, odd, amount, time: new Date() };
  bets.push(bet);
  res.json({ message: "Bet placed!", bet, balance: user.balance });
});

// Get user bets
app.get('/api/bets/:phone', (req, res) => {
  res.json(bets.filter(b => b.phone === req.params.phone));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sporty GH running on ${PORT}`));
