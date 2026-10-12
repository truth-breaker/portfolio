console.log('IT’S ALIVE!');


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
//gets us an array of all our nav links
let navLinks = $$("nav a");

// get the link to current page
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
);

currentLink?.classList.add('current');

