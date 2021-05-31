# Library App

### Author: Joseph Bakes (created on 28th May, 2021)

## Description
This was created as part of The Odin Project's Full Stack JavaScript curriculum. The aim is to build an app for managing a book collection.

### Things I've learned/practised
- Making objects (/classes) as functions
- Adding methods to the object's prototype
- Having an offscreen menu that can be opened and closed
- (FUTURE GOAL) Storing data in localStorage

### Things to add/improve
- Following the class/object definition method being taught in this lesson was constricting. I wanted to create more custom objects (e.g., for the add/edit book menu), but resources online for e.g., inheritance from HTML element classes almost all used ES6 Classes. If I were to remake this app, I would probably make custom `EditBookMenu` and `AddBookMenu` classes, and I'd also like to separate things out into modules for better readability.
- An option for cloud storage
- Visually, the app would look much better with covers. Obviously I can't host an up-to-date archive of book covers for the sake of this practice project. It looks like it would be possible to implement something using the [Open Library API](https://openlibrary.org/developers/api), but I don't know how fast it will be. Once a cover has been retrieved, would it be possible to cache the cover in localStorage? - This isn't something I've had a chance to explore yet.

### Patch notes (1st June, 2021)
- Implemented read status for the bookcase display and the edit menu.
- Implemented scrolling for the bookcase and set the edit menu position to update with scrolling.
- Implemented function for adding new books.
- Resolved some issues with adding/editing function.
- Prevented editing individual books from refreshing the whole bookcase.
- Changed edit menu to show different text depending on whether adding a new book or editing an existing book.
- Started to make some visual adjustments.

### TODO (1st June, 2021)
- Build upon edit function
    - Inactivate submit button (and show visually) for invalid input and before changes when editing.
- Add localStorage function
- Work out how to handle long text
    - flexible font size?
    - limit max length?
    - ellipsis or other suitable overflow method?
- Other improvements to appearance
    - Dynamically adjust the number of books per row to stay above a certain min width when the vieport width changes.