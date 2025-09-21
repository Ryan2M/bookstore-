const API_BASE = window.location.origin + '/api'; // assumes backend serves /api


async function fetchBooks(){
try{
const res = await fetch(API_BASE + '/books');
const data = await res.json();
renderBooks(data);
}catch(e){console.error('Fetch books error',e);}
}


function renderBooks(books){
const ul = document.getElementById('books');
ul.innerHTML = '';
if(!books || books.length===0){ul.innerHTML='<li>No books yet</li>';return}
books.forEach(b=>{
const li = document.createElement('li');
li.innerHTML = `
<div class="book-meta">
<div class="book-title">${escapeHtml(b.title)} — KSh ${Number(b.price).toFixed(2)}</div>
<div class="book-author">${escapeHtml(b.author)}</div>
</div>
<div>
<button class="delete-btn" data-id="${b.id}">Delete</button>
</div>
`;
ul.appendChild(li);
});
ul.querySelectorAll('.delete-btn').forEach(btn=>btn.addEventListener('click', async e=>{
const id = e.target.dataset.id;
await fetch(API_BASE + '/books/' + id, {method:'DELETE'});
fetchBooks();
}));
}


function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}


// form
const form = document.getElementById('bookForm');
form.addEventListener('submit', async e=>{
e.preventDefault();
const title = document.getElementById('title').value.trim();
const author = document.getElementById('author').value.trim();
const price = document.getElementById('price').value;
if(!title||!author||!price) return;
await fetch(API_BASE + '/books', {
method: 'POST', headers:{'Content-Type':'application/json'},
body: JSON.stringify({title,author,price})
});
form.reset();
fetchBooks();
});


document.getElementById('refreshBtn').addEventListener('click', fetchBooks);


// show year
document.getElementById('year').innerText = new Date().getFullYear();


// initial load
fetchBooks();
