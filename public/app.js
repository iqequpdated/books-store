const userId = 1

async function load(){

const books = await fetch("/api/books").then(r=>r.json())
const owned = await fetch(`/api/my-books/${userId}`).then(r=>r.json())

const box = document.getElementById("list")

books.forEach(b=>{

const unlocked = owned.includes(b.id)

const div = document.createElement("div")
div.className="book"

div.innerHTML = `
<h3>${b.title}</h3>

${unlocked
? `<a href="reader.html?book=${b.id}">📖 阅读</a>`
: `<button onclick="buy('${b.id}')">💰 购买 $${b.price}</button>`
}
`

box.appendChild(div)
})

}

function buy(bookId){

fetch("/api/buy",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({userId,bookId})
})
.then(r=>r.json())
.then(d=>{
window.location.href = d.url
})

}

load()