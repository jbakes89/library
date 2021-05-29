const testButton = document.querySelector(".js-test");
testButton.addEventListener("click", () => (toggleEditMenu()));

/* Global variables */
let myLibrary = [];

// HTML elements
const editMenu = document.querySelector(".js-edit-menu");
const bookcase = document.querySelector(".js-bookcase");
const editForm = document.querySelector(".js-edit-form");
const editCancelButton = document.querySelector(".js-edit-cancel-button");

// Flags
let inEditMode = false;
let bookBeingEdited = null;

/* Book Object Definition */
function Book(title, author, numOfPages, hasBeenRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.hasBeenRead = hasBeenRead;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ` + 
        `${this.numOfPages}p, ` +
        `${this.hasBeenRead ? "has been read" : "not read yet"}`;
};

Book.prototype.asDiv = function () {
    const template = document.querySelector(".js-book-template")
    const book = template.cloneNode(true);
    book.classList.remove("js-book-template");
    const map = {
        "{js-read}": `--${this.hasBeenRead ? "read" : "unread"}`,
        "{js-title}": this.title,
        "{js-author}": this.author,
        "{js-pages}": String(this.numOfPages),
        "{js-index}": myLibrary.indexOf(this)
    }
    let filterStrings = "";
    for (var prop in map) {
        filterStrings += `${prop}|`;
    }
    const filter = RegExp("(?:" + filterStrings.slice(0,-1) + ")", "g");
    book.innerHTML = book.innerHTML.replace(filter, match => { return map[match] });
    return book;
}

/* Core Functions */
// Adding books
function addBookToLibrary(book) {
    myLibrary.push(book);
    refreshBookDisplay();
}

function addBooksToLibrary(books) {
    for (book of books) {
        myLibrary.push(book);
    }
    refreshBookDisplay();
}

// Editing books
function editBook(book) {
    fillEditFormWith(book.title, book.author, book.numOfPages);
    inEditMode = true;
    bookBeingEdited = book;
    openEditMenu();
}

const editButtonPressed = function (e){
    const bookElement = e.target.closest(".js-book");
    const bookIndex = parseInt(bookElement.dataset.indexNumber);
    if (bookIndex < myLibrary.length) {
        editBook(myLibrary[bookIndex]);
    }
}

// Deleting books
function deleteBook(book) {
    myLibrary.splice(myLibrary.indexOf(book), 1);
    refreshBookDisplay();
}

function deleteBookAtIndex(index) {
    myLibrary.splice(index, 1);
    refreshBookDisplay();
}

const deleteButtonPressed = function (e){
    const bookElement = e.target.closest(".js-book");
    const bookIndex = parseInt(bookElement.dataset.indexNumber);
    if (bookIndex < myLibrary.length) {
        deleteBookAtIndex(bookIndex);
    }
}

// View
function refreshBookDisplay() {
    const fragment = document.createDocumentFragment();
    for (var book of myLibrary) {
        const bookElement = book.asDiv();
        bindEventsToBookElement(bookElement);
        fragment.appendChild(bookElement);
    }
    const booksWrapper = document.querySelector(".js-bookshelves-space");
    booksWrapper.innerHTML = "";
    booksWrapper.appendChild(fragment);
}


/* Edit Menu */
// Opening/closing
function openEditMenu() {
    // Make sure editMenu is visible
    editMenu.style.display = "block";
    editMenu.offsetWidth;

    editMenu.classList.remove("--js-hidden");
    bookcase.classList.add("--js-background");
}

function closeEditMenu() {
    editMenu.classList.add("--js-hidden");
    bookcase.classList.remove("--js-background");
}

function toggleEditMenu() {
    if (editMenu.classList.contains("--js-hidden")) {
        openEditMenu();
    } else {
        closeEditMenu();
    }
}

editMenu.addEventListener("transitionend", () => {
    if (editMenu.classList.contains("--js-hidden")) {
        // Actions after closing
        editMenu.style.display = "none";
        editForm.reset();
    }
})

// Submit
const submitForm = function(e) {
    if (e.target == editForm) {
        // Prevent default
        e.preventDefault();
        if (inEditMode) {
            bookBeingEdited.title = e.target.elements["edit-title"].value;
            bookBeingEdited.author = e.target.elements["edit-author"].value;
            bookBeingEdited.pages = parseInt(e.target.elements["edit-pages"].value);
            refreshBookDisplay();
            inEditMode = false;
            bookBeingEdited = null;
        } else {
            // Create book from input data
            const book = new Book(
                e.target.elements["edit-title"].value,
                e.target.elements["edit-author"].value,
                parseInt(e.target.elements["edit-pages"].value),
                false
            );
            // Add book to library
            addBookToLibrary(book);
        }

        // Close form
        closeEditMenu();
    }
}
editForm.addEventListener("submit", submitForm)


// Cancel
const cancelForm = function(e) {
    closeEditMenu();
}
editCancelButton.addEventListener("click", cancelForm);

// Pre-filling
function fillEditFormWith(title, author, pages) {
    editForm.elements["edit-title"].value = title;
    editForm.elements["edit-author"].value = author;
    editForm.elements["edit-pages"].value = parseInt(pages);
}


/* User Interaction */
function bindEventsToBookElement(bookElement) {
    const editButton = bookElement.querySelector(".js-book-edit-button");
    editButton.addEventListener("click", editButtonPressed);

    const deleteButton = bookElement.querySelector(".js-book-delete-button");
    deleteButton.addEventListener("click", deleteButtonPressed);
}

/* Keyboard Interaction */
const onKeydown = function(e) {
    switch (e.code) {
        // Handle "Enter" presses in book editing form
        case "Enter":
        case "NumpadEnter":
            if (e.target.form == editForm) {
                e.preventDefault();
                // Cycle focus
            }
            break;
        // Cancel form on "Escape" presses
        case "Escape":
        case "Esc":
            cancelForm();
            break;
    }
    if ((e.code == "Enter" || e.code == "NumpadEnter") && e.target.form == editForm) {
        e.preventDefault();
        // Cycle focus
    }
}
document.addEventListener("keydown", onKeydown);

// BOOK SAMPLE FOR TESTING
addBooksToLibrary([
    new Book("The Midnight Library", "Matt Haig", 288, false),
    new Book("Klara and the Sun", "Kazuo Ishiguro", 304, true),
    new Book("To Kill a Mockingbird", "Harper Lee", 324, false),
    new Book("The Little Prince", "Antoine de Saint-Exup\u00E9ry", 93, true),
    new Book("Harry Potter and the Deathly Hallows", "J.K. Rowling", 759, false)
]);