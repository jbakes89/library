/* Global variables */
let myLibrary = [];
const MIN_BOOK_WIDTH = "145px"; // No longer used for overall book sizing, but still used for font scaling.
// const MAX_BOOK_WIDTH = "200px";
const MIN_BOOK_WRAPPER_WIDTH = "150px";
const MAX_BOOK_WRAPPER_WIDTH = "215px";

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
let useLocalStorage = false;

/* Book Object Definition */
function Book(title, author, numOfPages, hasBeenRead) {
    this.title = title || "";
    this.author = author || "";
    this.numOfPages = numOfPages || 1;
    this.hasBeenRead = hasBeenRead || false;
    this.storageKey = null;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ` + 
        `${this.numOfPages}p, ` +
        `${this.hasBeenRead ? "has been read" : "not read yet"}`;
};

Book.prototype.asDiv = function () {
    const template = document.querySelector(".js-book-template")
    const bookWrapper = template.cloneNode(true);
    bookWrapper.classList.remove("js-book-template");
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
    bookWrapper.innerHTML = bookWrapper.innerHTML.replace(filter, match => { return map[match] });
    return bookWrapper;
}

Book.prototype.getElement = function () {
    return document.querySelector(`.js-book[data-index-number="${myLibrary.indexOf(this)}"]`);
}

Book.prototype.setReadStatus = function (readStatus) {
    this.hasBeenRead = readStatus;
    const bookIndex = myLibrary.indexOf(this);
    const bookElement = document.querySelector(`.js-book[data-index-number="${bookIndex}"]`);
    readStatus ? bookElement.classList.add("--js-read") : bookElement.classList.remove("--js-read");
    bookElement.querySelector(".js-book-read-checkbox").checked = readStatus;
    this.saveToStorage();
}

Book.prototype.toggleReadStatus = function () {
    this.setReadStatus(!this.hasBeenRead);
}

Book.prototype.toJSONString = function () {
    return JSON.stringify(this);
}

Book.prototype.saveToStorage = function () {
    saveBookToStorage(this);
}

Book.prototype.delete = function () {
    const bookIndex = myLibrary.indexOf(this);
    myLibrary.splice(bookIndex, 1);
    this.deleteFromStorage();
}

Book.prototype.deleteFromStorage = function () {
    deleteBookFromStorage(this);
}

Book.fromString = function (JSONString) {
    const parsedString = JSON.parse(JSONString);
    return Object.assign(new Book(), parsedString);
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
    book.delete();
    refreshWholeBookDisplay();
}

function deleteBookAtIndex(index) {
    myLibrary[index].delete();
    refreshWholeBookDisplay();
}

const deleteButtonPressed = function (e){
    const bookElement = e.target.closest(".js-book");
    const bookIndex = parseInt(bookElement.dataset.indexNumber);
    if (bookIndex < myLibrary.length) {
        const book = myLibrary[bookIndex];
        if (confirm(`Are you sure you want to delete ${book.title}?`)) { deleteBook(book); }
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


/* Updating bookcase view */
// Update/refresh books on display
function addToDisplayWithBooks(books) {
    const parsedArray = (books instanceof Book) ? [books] : books
    // const fragment = document.createDocumentFragment();
    for (var book of parsedArray) {
        const bookWrapper = book.asDiv();
        bindEventsToBookElement(bookWrapper);
        // fragment.appendChild(bookWrapper);
        bookshelvesSpace.appendChild(bookWrapper);
        fitTextOnBookElement(bookWrapper.querySelector(".js-book"));
    }
    // bookshelvesSpace.appendChild(fragment);
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
        // If book is not found in myLibrary, add a new book
        const newBook = new Book(newTitle, newAuthor, newPages, newReadStatus)
        addBookToLibrary(newBook);
        newBook.saveToStorage();
    } else {
        // Otherwise, edit existing book
        const bookElement = getBookElementWithIndex(bookIndex);
        bookElement.querySelector(".js-book-title").textContent = book.title = newTitle;
        bookElement.querySelector(".js-book-author").textContent = book.author = newAuthor;
        book.numOfPages = newPages;
        bookElement.querySelector(".js-book-pages").textContent = String(book.numOfPages) + "p";
        book.setReadStatus(newReadStatus);
        fitTextOnBookElement(bookElement);
        book.saveToStorage();
    }
}

function getBookElementWithIndex(bookIndex) {
    return bookshelvesSpace.querySelector(`.js-book[data-index-number="${bookIndex}"]`)
}

/* Responsive resizing */
// Useful functions
function getCurrentNumberOfColumns() {
    const computedStyle = window.getComputedStyle(bookshelvesSpace);
    return computedStyle.gridTemplateColumns.split(" ").length;
}

function getCurrentNumberOfRows() {
    const computedStyle = window.getComputedStyle(bookshelvesSpace);
    return computedStyle.gridTemplateRows.split(" ").length;
}

function changeNumberOfColumnsBy(n) {
    const delta = parseInt(n);
    if (delta) {
        const currentNumColumns = getCurrentNumberOfColumns();
        bookshelvesSpace.style.gridTemplateColumns = `repeat(${currentNumColumns + delta}, 1fr)`;
    }
}

function setNumberOfColumnsTo(n) {
    if (parseInt(n)) {
        const currentNumColumns = getCurrentNumberOfColumns();
        bookshelvesSpace.style.gridTemplateColumns = `repeat(${parseInt(n)}, 1fr)`;
    }
}

function elementOverflows(el) {
    return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}

// Resize books in grid when window is resized
const windowWasResized = function () {

    const minColumns = Math.ceil(bookshelvesSpace.offsetWidth / parseFloat(MAX_BOOK_WRAPPER_WIDTH));
    const maxColumns = Math.floor(bookshelvesSpace.offsetWidth / parseFloat(MIN_BOOK_WRAPPER_WIDTH));
    setNumberOfColumnsTo(Math.max(maxColumns, minColumns));


    /* Adjusting font size to fit on book*/
    // Baseline font size is set to fit decently at the MIN_BOOK_WIDTH, so we scale proportionally with the width
    const sampleBook = bookshelvesSpace.querySelector(".js-book, .js-add-book-button");
    let bookWidth = sampleBook.offsetWidth;
    const widthRatio = bookWidth/parseFloat(MIN_BOOK_WIDTH);

    const rootStyle = window.getComputedStyle(document.body)
    const baselineFontSize = rootStyle.getPropertyValue("--baseline-book-font-size");
    const newFontSize = `${parseFloat(baselineFontSize) * widthRatio}px`;
    document.documentElement.style.setProperty("--js-book-font-size", newFontSize);

    /* Ellipsize text */
    for (book of myLibrary) {
        fitTextOnBookElement(book.getElement());
    }
};

window.addEventListener("resize", windowWasResized);

/* Ellipsize text if it overflows its element */
function reduceTextContentOfElement(el) {
    if (elementOverflows(el)) {
        el.textContent = el.textContent.slice(0, -3) + "...";
        while (elementOverflows(el)) {
            el.textContent = el.textContent.slice(0, -4) + el.textContent.slice(-3);
        }
    }
}

function fitTextOnBookElement(el) {
    const pElements = el.querySelectorAll("p");
    pElements.forEach(p => {
        reduceTextContentOfElement(p);
    });
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
        /* Disable submit button if no changes have been made (I decided this wasn't
        necessary, especially since the submit button was changed to a check mark, instead
        of "Save Changes"). */
        // editSubmitButton.disabled = true;
    }

    // Make sure editMenu is visible
    editMenu.style.display = "block";
    editMenu.offsetWidth;

    editMenu.classList.remove("--js-hidden");
    bookshelvesSpace.classList.add("--js-background");
}

// Disable submit button when editing if nothing has been changed
function bookDetailsWillBeAltered() {
    if (bookBeingEdited) {
        return !(bookBeingEdited.title == editForm.elements["edit-title"].value &&
            bookBeingEdited.author == editForm.elements["edit-author"].value &&
            bookBeingEdited.numOfPages == parseInt(editForm.elements["edit-pages"].value) &&
            bookBeingEdited.hasBeenRead == editForm.elements["edit-read-status"].checked
        )
    } else {
        return true;
    }
}

// editForm.addEventListener("input", e => {
//     editSubmitButton.disabled = !bookDetailsWillBeAltered();
// })

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
        editSubmitButton.disabled = false;
        editForm.reset();
    } else {
        editForm.elements[0].focus();
    }
});

// Close with mouse click outside of edit menu
document.addEventListener("mousedown", e => {
    if (!editMenu.classList.contains("--js-hidden") && // Edit menu is open
        e.target == bookcase && // and click on bookcase
        e.clientX < editMenu.getBoundingClientRect().x
    ) {
        closeEditMenu();
    }
});


// Update top of editMenu when the bookcase is scrolled
bookcase.addEventListener("scroll", e => {
    // If bottom of editMenu visible lock to bottom of screen
    if ((bookcase.scrollTop + bookcase.offsetHeight) > (editMenu.offsetTop + editMenu.offsetHeight)) {
        editMenu.style.top = `${bookcase.scrollTop + bookcase.offsetHeight - editMenu.offsetHeight}px`;
    }
    // Else if top of editMenu visible lock to top of screen
    else if (editMenu.offsetTop > bookcase.scrollTop) {
        editMenu.style.top = `${bookcase.scrollTop}px`;
    }
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
    switch (e.key) {
        // Handle "Enter" presses in book editing form
        case "Enter":
        case "NumpadEnter":
            if (e.target.form == editForm) {
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

/* Local storage */
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        let x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // Everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // Test name field too
            // Everything except Firefox
            e.name === "QoutaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // Acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function loadBooksFromStorage() {
    if (useLocalStorage) {
        const storage = window.localStorage;
        Object.keys(storage).forEach( (bookKey) => {
            const fetchedBookString = storage.getItem(bookKey)
            const fetchedBook = Book.fromString(fetchedBookString);
            myLibrary.push(fetchedBook);
            addToDisplayWithBooks(fetchedBook);
        })
    }
}

function saveBookToStorage(book) {
    if (useLocalStorage) {
        const storage = window.localStorage;
        const key = book.storageKey ?? function() {
            const currentKeys = Object.keys(storage);
            let highestKey = -1;
            if (currentKeys.length > 0) {
                highestKey = Object.keys(storage).reduce((a,b) => {
                    return Math.max(a,b);
                });
            }
            const newKey = `${parseInt(highestKey) + 1}`
            book.storageKey = newKey;
            return newKey
        }();
        storage.setItem(key, book.toJSONString())
    }
}

function deleteBookFromStorage(book) {
    if (useLocalStorage) {
        const storage = window.localStorage;
        if (Object.keys(storage).includes(book.storageKey)) {
            storage.removeItem(book.storageKey);
        }
    }
}

function clearStorage() {
    if (useLocalStorage) {
        window.localStorage.clear();
    }
}

function testLargeNumberOfBooks() {
    clearStorage()
    let newBooks = []
    for (var i = 0; i < 500; i++) {
        const book = new Book(`Book-${i}`, `Author-${i}`, i, i % 3 == 0);
        book.saveToStorage();
        newBooks.push(book);
    }
    addBooksToLibrary(newBooks);
}


function main() {
    windowWasResized();

    if (storageAvailable("localStorage")) {
        useLocalStorage = true;
    } else {
        useLocalStorage = false;
        alert("Please note that the book collection will not be saved.\n" +
            "If you would like to save your collection, please check your local storage settings.");
    }

    // testLargeNumberOfBooks();

    // Load books from storage, or fill library with placeholder books if local storage is empty
    if (useLocalStorage) {
        if (window.localStorage.length > 0) {
            loadBooksFromStorage();
        } else {
            const placeholderBooks = [
                new Book("The Midnight Library", "Matt Haig", 288, false),
                new Book("Klara and the Sun", "Kazuo Ishiguro", 304, true),
                new Book("To Kill a Mockingbird", "Harper Lee", 324, false),
                new Book("The Little Prince", "Antoine de Saint-Exup\u00E9ry", 93, true),
                new Book("Harry Potter and the Deathly Hallows", "J.K. Rowling", 759, false),
                new Book("Noisy Outlaws, Unfriendly Blobs, and Some Other Things That Aren't as Scary, Maybe, Depending on How You Feel About Lost Lands, Stray Cellphones, Creatures from the Sky, Parents Who Disappear in Peru, a Man Named Lars Farf, and One Other Story We Couldn't Quite Finish, So Maybe You Could Help Us Out",
                    "Eli Horowitz (Editor), Ted Thompson (Editor), Neil Gaiman, Lemony Snicket, Nick Hornsby, George Saunders, Kelly Link, Richard Kennedy, Jon Scieszka, Sam Swope, Clement Freud, James Kochalka, Jeanne DuPrau, Jonathan Safran Foer",
                    208, false)
            ];
            addBooksToLibrary(placeholderBooks);
            for (book of placeholderBooks) {
                book.saveToStorage();
            }
        }
    }
}

main();