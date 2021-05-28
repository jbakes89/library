let myLibrary = [];

function Book(title, author, numOfPages, hasBeenRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.hasBeenRead = hasBeenRead;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ` + 
        `${this.numOfPages} pages, ` +
        `${this.hasBeenRead ? "has been read" : "not read yet"}`;
};

Book.prototype.asDiv = function () {
    const bookWrapper = document.createElement("div");
    bookWrapper.classList.add("l-book-wrapper");
    bookWrapper.innerHTML = `
        <div class="c-book js-book --${this.hasBeenRead ? "read" : "unread"}">
        <p class="c-book__title">${this.title}</p>
        <p class="c-book__author">${this.author}</p>
        <p class="c-book__pages">${this.numOfPages} pages</p>
        </div>
        `;
    return bookWrapper
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    updateDisplay();
}

function addBooksToLibrary(books) {
    for (book of books) {
        myLibrary.push(book);
    }
    updateDisplay();
}

function updateDisplay() {
    const fragment = document.createDocumentFragment();
    for (var book of myLibrary) {
        fragment.appendChild(book.asDiv());
    }
    const booksWrapper = document.querySelector(".js-bookshelves-space");
    booksWrapper.appendChild(fragment);
}

function show(book) {
    return;
}

addBooksToLibrary([
    new Book("The Midnight Library", "Matt Haig", 288, false),
    new Book("Klara and the Sun", "Kazuo Ishiguro", 304, true),
    new Book("To Kill a Mockingbird", "Harper Lee", 324, false),
    new Book("The Little Prince", "Antoine de Saint-Exup\u00E9ry", 93, true),
    new Book("Harry Potter and the Deathly Hallows", "J.K. Rowling", 759, false)
]);