const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const games = [
  { id: 1, home: "Hearts of Oak", away: "Asante Kotoko", odds: { home: 2.1, draw: 3.0, away: 2.8 }, time: "18:00" },
  { id: 2, home: "Arsenal", away: "Man City", odds: { home: 3.5, draw: 3.2, away: 2.0 }, time: "19:30" },
  { id: 3, home: "Real Madrid", away: "Barcelona", odds: { home: 2.2, draw: 3.4, away: 2.9 }, time: "20:00" },
  { id: 4, home: "Chelsea", away: "Liverpool", odds: { home: 2.5, draw: 3.1, away: 2.7 }, time: "20:45" }
];
let wallet = 0; let bets = [];

app.get('/', (req,res)=>res.send('SPORTY GH BACKEND LIVE! Go to /api/games'));
app.get('/api/games',(req,res)=>res.json(games));
app.get('/api/wallet',(req,res)=>res.json({balance:wallet}));
app.get('/api/bets',(req,res)=>res.json(bets));
app.post('/api/deposit',(req,res)=>{wallet+=Number(req.body.amount);res.json({success:true,balance:wallet})});
app.post('/api/bet',(req,res)=>{const{gameId,amount,pick}=req.body;if(wallet<amount)return res.json({error:"Low balance"});wallet-=amount;const bet={id:Date.now(),gameId,amount,pick,status:"pending"};bets.push(bet);res.json({success:true,bet,balance:wallet})});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('Live'));
