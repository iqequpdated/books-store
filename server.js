const express = require("express")
const cors = require("cors")
const db = require("./db")
const stripe = require("stripe")("sk_test_xxx") // 测试Key

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

/* ================= BOOK LIST ================= */
app.get("/api/books",(req,res)=>{
db.all("SELECT * FROM books",(err,rows)=>{
res.json(rows)
})
})

/* ================= USER PURCHASE ================= */
app.get("/api/my-books/:user",(req,res)=>{
db.all(
"SELECT book_id FROM purchases WHERE user_id=?",
[req.params.user],
(err,rows)=>{
res.json(rows.map(r=>r.book_id))
})
})

/* ================= CREATE PAYMENT ================= */
app.post("/api/buy", async (req,res)=>{
const { userId, bookId } = req.body

const session = await stripe.checkout.sessions.create({
payment_method_types:["card"],
mode:"payment",
line_items:[{
price_data:{
currency:"usd",
product_data:{name:bookId},
unit_amount:500
},
quantity:1
}],
success_url:"http://localhost:3000/success?book="+bookId,
cancel_url:"http://localhost:3000"
})

res.json({ url: session.url })
})

/* ================= SUCCESS ================= */
app.get("/success",(req,res)=>{

const bookId = req.query.book

db.run(
"INSERT INTO purchases(user_id,book_id) VALUES(?,?)",
[1,bookId]
)

res.send("✔ 购买成功，返回书城即可解锁")
})

app.listen(3000,()=>{
console.log("Book Store running http://localhost:3000")
})