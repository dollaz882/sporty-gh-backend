const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let bets = [];
let deposits = [];
const ADMIN_MOMO = "0541378002"; // YOUR REAL MOMO - Benjamin

const matches = [
  { id: 1, home: "Hearts of Oak", away: "Asante Kotoko", odd1: "2.40", oddX: "2.90", odd2: "2.80", league: "Ghana Premier" },
  { id: 2, home: "Man City", away: "Arsenal", odd1: "1.90", oddX: "3.40", odd2: "4.00", league: "Premier League" },
  { id: 3, home: "Barcelona", away: "Real Madrid", odd1: "2.50", oddX: "3.80", odd2: "2.60", league: "La Liga" },
];

app.get('/', (req,res)=>res.send(`Sporty GH LIVE! MoMo: ${ADMIN_MOMO} 🇬🇭`));
app.get('/api/matches',(req,res)=>res.json(matches));
app.get('/api/momo-number',(req,res)=>res.json({momoNumber: ADMIN_MOMO}));

app.post('/api/register', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: "Phone and password required" });
  if (users.find(u => u.phone === phone)) return res.status(400).json({ error: "User already exists" });
  const user = { id: users.length + 1, phone, password, balance: 0 };
  users.push(user);
  res.json({ message: "Registered!", user: { id: user.id, phone: user.phone, balance: user.balance } });
});

app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);
  if (!user) return res.status(400).json({ error: "Wrong phone or password" });
  res.json({ message: "Login success", user: { id: user.id, phone: user.phone, balance: user.balance } });
});

// REAL MOMO DEPOSIT - Collect real money to 0541378002
app.post('/api/deposit/manual', (req,res)=>{
  const {phone, amount, momoTransactionId, senderNumber}=req.body;
  const user=users.find(u=>u.phone===phone);
  if(!user) return res.status(404).json({error:"User not found - Register first"});
  const dep={id:deposits.length+1, phone, amount: Number(amount), momoTransactionId, senderNumber, status:"pending", time: new Date()};
  deposits.push(dep);
  res.json({message:`SUCCESS! Send GHS ${amount} to 0541378002. ID: ${momoTransactionId} will be approved in 2 mins`, deposit: dep});
});

app.post('/api/deposit/approve/:id', (req,res)=>{
  const dep=deposits.find(d=>d.id==req.params.id);
  if(!dep) return res.status(404).json({error:"Not found"});
  if(dep.status==="approved") return res.json({message:"Already approved"});
  dep.status="approved";
  const user=users.find(u=>u.phone===dep.phone);
  if(user) user.balance+=dep.amount;
  res.json({message:`GHS ${dep.amount} added to ${dep.phone}`, userBalance: user?.balance, deposit: dep});
});

app.get('/api/deposits', (req,res)=>res.json(deposits));
app.get('/api/deposits/:phone', (req,res)=>res.json(deposits.filter(d=>d.phone===req.params.phone)));

app.post('/api/bet',(req,res)=>{
  const {phone,matchId,odd,amount}=req.body;
  const user=users.find(u=>u.phone===phone);
  if(!user) return res.status(404).json({error:"Login first"});
  if(user.balance<amount) return res.status(400).json({error:"Insufficient balance - Deposit to 0541378002"});
  user.balance-=amount;
  const bet={id:bets.length+1,phone,matchId,odd,amount,time:new Date()};
  bets.push(bet);
  res.json({message:"Bet placed!",bet,balance:user.balance});
});

app.get('/api/bets/:phone',(req,res)=>res.json(bets.filter(b=>b.phone===req.params.phone)));

const PORT=process.env.PORT||10000;
app.listen(PORT,()=>console.log(`Running - MoMo: ${ADMIN_MOMO}`));
