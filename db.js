const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./data.sqlite")

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS books (
id TEXT PRIMARY KEY,
title TEXT,
price REAL
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS purchases (
user_id INTEGER,
book_id TEXT
)
`)

// 初始书籍
db.run(`INSERT OR IGNORE INTO books VALUES
('goodlife','好心情人生',5),
('deepwork','深度工作',8),
('thinking','思考快与慢',6)
`)

})

module.exports = db