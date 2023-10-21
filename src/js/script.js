function changeIsFinishedReadingText() {
    const isFinishedReading = document.querySelector('#isFinishedReading');
    const finishedReadingText = document.querySelector('#finishedReadingText');
    if (isFinishedReading.checked) {
        finishedReadingText.classList.remove('bg-danger');
        finishedReadingText.classList.add('bg-success');
        finishedReadingText.textContent = 'Finished Reading Rack';
    } else {
        finishedReadingText.classList.remove('bg-success');
        finishedReadingText.classList.add('bg-danger');
        finishedReadingText.textContent = 'Not Finished Reading Rack';
    }
}

function searchBooks() {
    const searchTerm = document.getElementById('searchTitle').value.toLowerCase();
    const bookList = JSON.parse(localStorage.getItem('books')) || [];
    const filteredBooks = bookList.filter(book => book.title.toLowerCase().includes(searchTerm));
    displayBooks(filteredBooks);
}

function displayBooks(books) {
    const notFinishedReadingList = document.getElementById('notFinishedReadingList');
    const finishedReadingList = document.getElementById('finishedReadingList');

    notFinishedReadingList.innerHTML = '';
    finishedReadingList.innerHTML = '';

    books.forEach(book => {
        const bookEntry = generateBookEntry(book);
        if (book.isComplete) {
            finishedReadingList.appendChild(bookEntry);
        } else {
            notFinishedReadingList.appendChild(bookEntry);
        }
    });
}

function addBookToLocalStorage() {
    const title = document.getElementById('title').value;
    const writer = document.getElementById('writer').value;
    const year = document.getElementById('year').value;
    const isFinishedReading = document.getElementById('isFinishedReading').checked;

    const id = Date.now();

    const book = {
        id,
        title,
        author: writer,
        year: parseInt(year),
        isComplete: isFinishedReading,
    };

    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    existingBooks.push(book);

    localStorage.setItem('books', JSON.stringify(existingBooks));

    document.getElementById('title').value = '';
    document.getElementById('writer').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isFinishedReading').checked = false;

    alert('Book added to local storage!');
    window.location.reload();
}

function saveEditedBookDetails(bookId) {
    const editTitle = document.getElementById('editTitle').value;
    const editWriter = document.getElementById('editWriter').value;
    const editYear = document.getElementById('editYear').value;
    const editIsFinishedReading = document.getElementById('editIsFinishedReading').checked;

    const books = JSON.parse(localStorage.getItem('books')) || [];

    const bookToEdit = books.find((book) => book.id === bookId);

    if (bookToEdit) {
        bookToEdit.title = editTitle;
        bookToEdit.author = editWriter;
        bookToEdit.year = editYear;
        bookToEdit.isComplete = editIsFinishedReading;

        localStorage.setItem('books', JSON.stringify(books));

        window.location.reload();
    }
}

function generateBookEntry(book) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-2');

    const cardRow = document.createElement('div');
    cardRow.classList.add('row', 'g-0');

    const cardCol = document.createElement('div');
    cardCol.classList.add('col-md-4');

    const cardImg = document.createElement('img');
    cardImg.src = 'https://picsum.photos/id/24/200';

    const cardCol8 = document.createElement('div');
    cardCol8.classList.add('col-md-8');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h4');
    title.classList.add('card-title', 'fw-bold', 'mb-3');
    title.textContent = book.title;

    const writerRow = document.createElement('div');
    writerRow.classList.add('d-flex', 'align-items-center');

    const writerLabel = document.createElement('p');
    writerLabel.classList.add('fw-bold');
    writerLabel.textContent = 'Writer:';

    const writerName = document.createElement('p');
    writerName.classList.add('ms-2');
    writerName.textContent = book.author;

    writerRow.appendChild(writerLabel);
    writerRow.appendChild(writerName);

    const yearRow = document.createElement('div');
    yearRow.classList.add('d-flex', 'align-items-center');

    const yearLabel = document.createElement('p');
    yearLabel.classList.add('fw-bold');
    yearLabel.textContent = 'Year:';

    const yearValue = document.createElement('p');
    yearValue.classList.add('ms-2');
    yearValue.textContent = book.year;

    yearRow.appendChild(yearLabel);
    yearRow.appendChild(yearValue);

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('row');

    const buttonCol = document.createElement('div');
    buttonCol.classList.add('col');

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-sm', 'btn-info', 'fw-bold', 'me-2');
    editButton.innerHTML = '<i class="fa fa-pencil"></i> Edit';

    const updateButton = document.createElement('button');
    updateButton.classList.add('btn', 'btn-sm', `btn-${book.isComplete ? 'warning' : 'success'}`, 'fw-bold', 'me-2');
    updateButton.innerHTML = `<i class="fa fa-${book.isComplete ? 'times' : 'check'}"></i> Mark as ${book.isComplete ? 'Not ' : ''}Finished`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'fw-bold');
    deleteButton.innerHTML = '<i class="fa fa-trash"></i> Delete';

    updateButton.addEventListener('click', () => {
        book.isComplete = !book.isComplete;

        const books = JSON.parse(localStorage.getItem('books')) || [];

        const updatedBooks = books.map((storedBook) => {
            if (storedBook.id === book.id) {
                return { ...storedBook, isComplete: book.isComplete };
            }
            return storedBook;
        });

        localStorage.setItem('books', JSON.stringify(updatedBooks));

        populateBookEntries();
    });

    editButton.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade', 'show', 'd-block');

        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Book Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="editTitle" class="form-label text-primary fw-bold">Title</label>
                        <input type="text" class="form-control" id="editTitle" value="${book.title}">
                    </div>
                    <div class="mb-3">
                        <label for="editWriter" class="form-label text-primary fw-bold">Writer</label>
                        <input type="text" class="form-control" id="editWriter" value="${book.author}">
                    </div>
                    <div class="mb-3">
                        <label for="editYear" class="form-label text-primary fw-bold">Year</label>
                        <input type="number" class="form-control" id="editYear" value="${book.year}">
                    </div>
                    <div class="mb-3">
                        <label class="form-check-label text-primary fw-bold" for="editIsFinishedReading">Finished Reading</label>
                        <input type="checkbox" class="form-check-input" id="editIsFinishedReading" ${book.isComplete ? 'checked' : ''}>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveEditedBookDetails(${book.id})">Save Changes</button>
                </div>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        new bootstrap.Modal(modal, {
            backdrop: 'static',
            keyboard: false,
        }).show();
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this book?')) {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            const updatedBooks = books.filter((b) => b.id !== book.id);
            localStorage.setItem('books', JSON.stringify(updatedBooks));

            populateBookEntries();
        }
    });


    buttonCol.appendChild(editButton);
    buttonCol.appendChild(updateButton);
    buttonCol.appendChild(deleteButton);

    buttonRow.appendChild(buttonCol);

    cardBody.appendChild(title);
    cardBody.appendChild(writerRow);
    cardBody.appendChild(yearRow);
    cardBody.appendChild(buttonRow);

    cardCol.appendChild(cardImg);
    cardCol8.appendChild(cardBody);
    cardRow.appendChild(cardCol);
    cardRow.appendChild(cardCol8);
    card.appendChild(cardRow);

    return card;
}

function populateBookEntries() {
    const notFinishedReadingList = document.getElementById('notFinishedReadingList');
    const finishedReadingList = document.getElementById('finishedReadingList');

    const books = JSON.parse(localStorage.getItem('books')) || [];

    notFinishedReadingList.innerHTML = '';
    finishedReadingList.innerHTML = '';

    books.forEach((book) => {
        const bookEntry = generateBookEntry(book);
        if (book.isComplete) {
            finishedReadingList.appendChild(bookEntry);
        } else {
            notFinishedReadingList.appendChild(bookEntry);
        }
    });
}

populateBookEntries();
