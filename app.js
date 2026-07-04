const API_URL = 'http://localhost:5000';

const booksList = document.getElementById('books-list');
const form = document.getElementById('book-form');

document.addEventListener('DOMContentLoaded', fetchBooks);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const isbn = document.getElementById('isbn').value.trim();
  if (!title || !author) return alert('العنوان والمؤلف مطلوبان');

  await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, isbn })
  });
  form.reset();
  fetchBooks();
});

async function fetchBooks() {
  const res = await fetch(`${API_URL}/books`);
  const data = await res.json();
  if (data.length === 0) {
    booksList.innerHTML = '<p>لا توجد كتب بعد. أضف أول كتاب!</p>';
    return;
  }
  booksList.innerHTML = data.map(book => `
    <div class="book-card">
      <div class="book-info">
        <strong>${book.title}</strong> – ${book.author}
        ${book.isbn ? `<br><small>ISBN: ${book.isbn}</small>` : ''}
      </div>
      <div class="book-actions">
        <button class="edit" onclick="editBook(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', '${(book.isbn||'').replace(/'/g, "\\'")}')">✏️ تعديل</button>
        <button onclick="deleteBook(${book.id})">🗑️ حذف</button>
      </div>
    </div>
  `).join('');
}

async function deleteBook(id) {
  if (!confirm('متأكد من الحذف؟')) return;
  await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
  fetchBooks();
}

function editBook(id, oldTitle, oldAuthor, oldIsbn) {
  const newTitle = prompt('عنوان الكتاب:', oldTitle);
  if (newTitle === null) return;
  const newAuthor = prompt('المؤلف:', oldAuthor);
  if (newAuthor === null) return;
  const newIsbn = prompt('ISBN:', oldIsbn);
  if (newIsbn === null) return;

  (async () => {
    await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, author: newAuthor, isbn: newIsbn })
    });
    fetchBooks();
  })();
}