# Library App

### Author: Joseph Bakes (created on 28th May, 2021)

## Description
This was created as part of The Odin Project's Full Stack JavaScript curriculum. The aim is to build an app for managing a book collection.

As of 3rd June, 2021, the project is finished for now. The things I've learned and practised, as well as potential additions/improvements for the future, are described below.

## Update (starting 6th July, 2021)
As per the "Classes" lesson of the "Javascript" course on the TOP Full Stack JavaScript path, I am updating the Library app using ES6 Classes.

### Things I've learned/practised
- Making objects (/classes) as functions
- Adding methods to the object's prototype
- Having an offscreen menu that can be opened and closed
- Customising checkbox appearance
- Storing data in localStorage

### Things to add/improve
- Following the class/object definition method being taught in this lesson was constricting. I wanted to create more custom objects (e.g., for the add/edit book menu), but resources online for e.g., inheritance from HTML element classes almost all used ES6 Classes. If I were to remake this app, I would probably make custom `EditBookMenu` and `AddBookMenu` classes, and I'd also like to separate things out into modules for better readability.
- An option for cloud storage
- Visually, the app would look much better with covers. Obviously I can't host an up-to-date archive of book covers for the sake of this practice project. It looks like it would be possible to implement something using the [Open Library API](https://openlibrary.org/developers/api), but I don't know how fast it will be. Once a cover has been retrieved, would it be possible to cache the cover in localStorage? - This isn't something I've had a chance to explore yet.
- Undo function to revert prior changes
- It might be better to have the edit menu open when clicking anywhere on a book (and maybe get rid of the edit book button).
- I feel like there ought to be a more efficient way of truncating text than going one character at a time. Now that the design is mostly complete, the ellipsizing function could be made much more efficient for *very* long titles by setting a `MAXIMUM_DISPLAYABLE_TITLE_LENGTH` (e.g., 100 characters or so), and reducing the title to this length before starting the loop. However, for this practice project, I wanted to keep the function as design-agnostic as possible.

### Patch notes (6th July, 2021)
- Updated to use `class` for the `Book` class.
    - As stated above, I think the whole script could be reformatted with better scoping, but I don't think this would be the best use of my time at the moment, since I will be able to practise these skills in future projects throughout the course. 


## External Resources
### Icons
Some of the icons used on this site were taken from Google's Material Icons (available [here](https://fonts.google.com/icons) at the time of writing). Specifically, these were "/assets/delete_icon.svg", "/assets/edit_icon.svg", and "/assets/read_icon.svg". These icons are available for use under the [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).