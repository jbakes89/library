/* Global variables */
let myLibrary = [];

// HTML elements
const editMenu = document.querySelector(".js-edit-menu");
const bookcase = document.querySelector(".js-bookcase");
const bookshelvesSpace = document.querySelector(".js-bookshelves-space");
const editForm = document.querySelector(".js-edit-form");
const editSubmitButton = document.querySelector(".js-edit-submit-button");
const editCancelButton = document.querySelector(".js-edit-cancel-button");
const addBookButton = document.querySelector(".js-add-book-button");

// Flags
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
        "{js-read-class}": `${this.hasBeenRead ? " --js-read" : ""}`,
        "{js-title}": this.title,
        "{js-author}": this.author,
        "{js-pages}": String(this.numOfPages),
        "{js-index}": myLibrary.indexOf(this),
        "{js-read-checkbox}": this.hasBeenRead ? " checked" : ""
    }
    let filterStrings = "";
    for (var prop in map) {
        filterStrings += `${prop}|`;
    }
    const filter = RegExp("(?:" + filterStrings.slice(0,-1) + ")", "g");
    book.innerHTML = book.innerHTML.replace(filter, match => { return map[match] });
    return book;
}

Book.prototype.setReadStatus = function (readStatus) {
    this.hasBeenRead = readStatus;
    const bookIndex = myLibrary.indexOf(this);
    const bookElement = document.querySelector(`.js-book[data-index-number="${bookIndex}"]`);
    readStatus ? bookElement.classList.add("--js-read") : bookElement.classList.remove("--js-read");
    bookElement.querySelector(".js-book-read-checkbox").checked = readStatus;
}

Book.prototype.toggleReadStatus = function () {
    this.setReadStatus(!this.hasBeenRead);
}

/* Core Functions */
// Adding books
function addBookToLibrary(book) {
    myLibrary.push(book);
    addToDisplayWithBooks(book);
}

function addBooksToLibrary(books) {
    for (book of books) {
        myLibrary.push(book);
    }
    addToDisplayWithBooks(books);
}

addBookButton.addEventListener("click", openAddMenu);

// Editing books
function editBook(book) {
    fillEditFormWith(book.title, book.author, book.numOfPages, book.hasBeenRead);
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
    refreshWholeBookDisplay();
}

function deleteBookAtIndex(index) {
    myLibrary.splice(index, 1);
    refreshWholeBookDisplay();
}

const deleteButtonPressed = function (e){
    const bookElement = e.target.closest(".js-book");
    const bookIndex = parseInt(bookElement.dataset.indexNumber);
    if (bookIndex < myLibrary.length) {
        deleteBookAtIndex(bookIndex);
    }
}

// Changing read status
const readCheckboxToggled = function (e){
    const bookElement = e.target.closest(".js-book");
    const bookIndex = parseInt(bookElement.dataset.indexNumber);
    if (bookIndex < myLibrary.length) {
        myLibrary[bookIndex].setReadStatus(e.target.checked);
    }
}


/* Updating view */
// Update/refresh books on display
function addToDisplayWithBooks(books) {
    const parsedArray = (books instanceof Book) ? [books] : books
    const fragment = document.createDocumentFragment();
    for (var book of parsedArray) {
        const bookElement = book.asDiv();
        bindEventsToBookElement(bookElement);
        fragment.appendChild(bookElement);
    }
    bookshelvesSpace.appendChild(fragment);    
}

function refreshWholeBookDisplay() {
    const addBookNode = bookshelvesSpace.firstElementChild;
    bookshelvesSpace.innerHTML = "";
    bookshelvesSpace.appendChild(addBookNode);
    addToDisplayWithBooks(myLibrary);
}

function updateBook(book, newTitle, newAuthor, newPages, newReadStatus) {
    const bookIndex = myLibrary.indexOf(book);
    if (bookIndex == -1) {
        addBookToLibrary(new Book(newTitle, newAuthor, newPages, newReadStatus));
    } else {
        const bookElement = bookshelvesSpace.querySelector(`.js-book[data-index-number="${bookIndex}"]`);
        bookElement.querySelector(".js-book-title").textContent = book.title = newTitle;
        bookElement.querySelector(".js-book-author").textContent = book.author = newAuthor;
        bookElement.querySelector(".js-book-pages").textContent = book.numOfPages = String(newPages) + "p";
        book.setReadStatus(newReadStatus);
    }
}


/* Edit/Add Menu */
// Opening
function openAddMenu() {
    editForm.reset();
    openEditMenu(true);
}

function openEditMenu(inAddMode) {
    if (inAddMode) {
        editSubmitButton.textContent = "+";
        editSubmitButton.classList.add("--js-add-mode");
    } else {
        editSubmitButton.textContent = "\u2713";
        editSubmitButton.classList.remove("--js-add-mode");
        // Disable submit button if no changes have been made
        editSubmitButton.disabled = true;
    }

    // Make sure editMenu is visible
    editMenu.style.display = "block";
    editMenu.offsetWidth;

    editMenu.classList.remove("--js-hidden");
    bookshelvesSpace.classList.add("--js-background");
}

// Check for changes on input
function bookDetailsHaveBeenEdited() {
    return !(bookBeingEdited.title == editForm.elements["edit-title"].value &&
        bookBeingEdited.author == editForm.elements["edit-author"].value &&
        bookBeingEdited.numOfPages == parseInt(editForm.elements["edit-pages"].value) &&
        bookBeingEdited.hasBeenRead == editForm.elements["edit-read-status"].checked
    )
}

editForm.addEventListener("input", e => {
    editSubmitButton.disabled = !bookDetailsHaveBeenEdited();
})

// Closing
function closeEditMenu() {
    editMenu.classList.add("--js-hidden");
    bookshelvesSpace.classList.remove("--js-background");
    bookBeingEdited = null;
}

// Toggle open/closed
function toggleEditMenu() {
    if (editMenu.classList.contains("--js-hidden")) {
        openEditMenu();
    } else {
        closeEditMenu();
    }
}

// Actions after transition
editMenu.addEventListener("transitionend", () => {
    if (editMenu.classList.contains("--js-hidden")) {
        editMenu.style.display = "none";
        editForm.reset();
    } else {
        editForm.elements[0].focus();
    }
});

// Close with mouse click outside of edit menu
document.addEventListener("mousedown", e => {
    if (!editMenu.classList.contains("--js-hidden") && // Edit menu is open
        e.target != editMenu && // and click outside edit menu
        !editMenu.contains(e.target) // and its children...
    ) {
        closeEditMenu();
    }
});


// Update top of editMenu when the bookcase is scrolled
bookcase.addEventListener("scroll", e => {
    editMenu.style.top = `${bookcase.scrollTop}px`;
});


// Submit
function submitEditForm() {
    if (editForm.reportValidity()) {
        updateBook(bookBeingEdited,
            editForm.elements["edit-title"].value,
            editForm.elements["edit-author"].value,
            parseInt(editForm.elements["edit-pages"].value),
            editForm.elements["edit-read-status"].checked);
        bookBeingEdited = null;

        // Close form
        closeEditMenu();
    }
}
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitEditForm();
});


// Cancel
const cancelEditForm = function(e) {
    closeEditMenu();
}
editCancelButton.addEventListener("click", cancelEditForm);

// Pre-filling
function fillEditFormWith(title, author, pages, readStatus) {
    editForm.elements["edit-title"].value = title;
    editForm.elements["edit-author"].value = author;
    editForm.elements["edit-pages"].value = parseInt(pages);
    editForm.elements["edit-read-status"].checked = readStatus;
}


/* User Interaction */
function bindEventsToBookElement(bookElement) {
    const editButton = bookElement.querySelector(".js-book-edit-button");
    editButton.addEventListener("click", editButtonPressed);

    const deleteButton = bookElement.querySelector(".js-book-delete-button");
    deleteButton.addEventListener("click", deleteButtonPressed);

    const readCheckbox = bookElement.querySelector(".js-book-read-checkbox");
    readCheckbox.addEventListener("click", readCheckboxToggled);
}

/* Keyboard Interaction */
const onKeydown = function(e) {
    console.log(`Keydown event with code ${e.key}`)
    switch (e.key) {
        // Handle "Enter" presses in book editing form
        case "Enter":
        case "NumpadEnter":
            if (e.target.form == editForm) {
                console.log(`activeElement is ${document.activeElement}`);
                e.preventDefault();
                submitEditForm();
            }
            break;
        // Cancel form on "Escape" presses
        case "Escape":
        case "Esc":
            cancelEditForm();
            break;
        case "NumpadAdd":
        case "+":
            openAddMenu();
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