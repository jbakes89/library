# Library App

### Author: Joseph Bakes (created on 28th May, 2021)

## Description
This was created as part of The Odin Project's Full Stack JavaScript curriculum. The aim is to build an app for managing a book collection.

### Things I've learned/practised
- Making objects (/classes) as functions
- Adding methods to the object's prototype
- Having an offscreen menu that can be opened and closed
- Customising checkbox appearance
- (FUTURE GOAL) Storing data in localStorage

### Things to add/improve
- Following the class/object definition method being taught in this lesson was constricting. I wanted to create more custom objects (e.g., for the add/edit book menu), but resources online for e.g., inheritance from HTML element classes almost all used ES6 Classes. If I were to remake this app, I would probably make custom `EditBookMenu` and `AddBookMenu` classes, and I'd also like to separate things out into modules for better readability.
- An option for cloud storage
- Visually, the app would look much better with covers. Obviously I can't host an up-to-date archive of book covers for the sake of this practice project. It looks like it would be possible to implement something using the [Open Library API](https://openlibrary.org/developers/api), but I don't know how fast it will be. Once a cover has been retrieved, would it be possible to cache the cover in localStorage? - This isn't something I've had a chance to explore yet.
- Undo function to revert last change

### Patch notes (2nd June, 2021)
- Cleaned up the appearance of the buttons on the books, including a custom checkbox/toggle button.
- Implemented local storage.
- Added a `confirm` box before deleting a book.
- Implemented responsive grid sizing and font sizes on the book covers.

### TODO (2nd June, 2021)
- Improve edit menu
    - Inactivate submit button (and show visually) for invalid input and before changes when editing.
    - Figure out how to prevent the edit menu being squashed when the window height is too small
        - Setting `overflow-y: scroll` is okay, but the double scrollbar doesn't look nice. I know I can hide the scrollbar 

## External Resources
### Icons
Some of the icons used on this site were taken from Google's Material Icons (available [here](https://fonts.google.com/icons) at the time of writing). Specifically, these were "/assets/delete_icon.svg", "/assets/edit_icon.svg", and "/assets/read_icon.svg". These icons are available for use under the [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).