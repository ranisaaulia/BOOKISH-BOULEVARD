let books = [];
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'Library_Store';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    loadBooksFromStorage();
  });

document.addEventListener(RENDER_EVENT, function () {
    const booksList = document.getElementById('books');
    booksList.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBookElement(book);
        booksList.appendChild(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function() {
    const message = "Data berhasil disimpan!"; 
    showToast(message); 
  });


function renderBooks() {
    const booksList = document.getElementById('books');
    booksList.innerHTML = '';

    for (const book of books) {
      const bookElement = makeBookElement(book);
      booksList.appendChild(bookElement);

    }
}

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    saveBooksToStorage();
    const bookElement = makeBookElement(bookObject);
    document.getElementById('books').appendChild(bookElement);
}

function generateId() {
    return +new Date();
  }
   
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function makeBookElement(book) {
  const bookTitle = document.createElement('h2');
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Author: ${book.author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Year: ${book.year}`;

  const bookStatus = document.createElement('p');
  bookStatus.innerText = book.isComplete ? 'Status: Finished Reading' : 'Status: Unfinished Reading';
  bookStatus.classList.add(book.isComplete ? 'finished-status' : 'unfinished-status'); // Menambahkan class berdasarkan status buku

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = book.isComplete; // Menandai checkbox sesuai status buku
  checkbox.disabled = true; // Memastikan checkbox tidak dapat diubah
  checkbox.classList.add('status-checkbox'); // Tambahkan kelas untuk styling CSS

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', function () {
      removeBook(book.id); // Function to remove the book
  });

  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book', 'shadow');
  bookContainer.appendChild(bookTitle);
  bookContainer.appendChild(bookAuthor);
  bookContainer.appendChild(bookYear);
  bookContainer.appendChild(bookStatus);
  bookContainer.appendChild(deleteButton); // Add the delete button

  return bookContainer;
}

function removeBook(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooksToStorage();
      renderBooks();
  }
}

function saveBooks() {
  if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function isStorageExist() {
  if (typeof Storage === 'undefined') {
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}

function loadBooksFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
      books = data;
      renderBooks();
  }
}
   
  


  