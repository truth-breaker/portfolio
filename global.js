console.log('IT’S ALIVE!');


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3.1: the pages on the site
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'cv/', title: 'CV' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/truth-breaker', title: 'GitHub' },
];
// Works locally and on GitHub Pages
const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/' // Local server
    : '/portfolio/'; // GitHub Pages repo name
// Create a <nav> element and place it at the top of the page   
let nav = document.createElement('nav');
document.body.prepend(nav);
//loop thru each page and create a navigation link
for (let p of pages) {
  let url = p.url;
  let title = p.title;
//add the github pages base path to internal links
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  // Create link and add it to nav
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

  // Current page highlight and external link behavior
  let a = nav.lastElementChild;
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );
  if (a.host !== location.host) {
    a.target = '_blank';
  }
}

// Step 4.2: color scheme switch
document.body.insertAdjacentHTML(
  'afterbegin',
  `

    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`,

);
//get a reference to the dropdown menu
let select = document.querySelector('.color-scheme select');

// If a saved color scheme exists, use it
if ('colorScheme' in localStorage) {
  document.documentElement.style.setProperty(
    'color-scheme',
    localStorage.colorScheme
  );

  // Update the dropdown so it matches the saved value
  select.value = localStorage.colorScheme;
}

//changes to the dropdown menu
select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
//Update the CSS color-scheme property on the root element
//so the browser switches btwn light and dark mode
  document.documentElement.style.setProperty(
    'color-scheme',
    event.target.value
  );
 // Save user's theme preference
  localStorage.colorScheme = event.target.value;

});

let form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let data = new FormData(form);

  let url = form.action + '?';

  for (let [name, value] of data) {
    value = encodeURIComponent(value);

    url += `${name}=${value}&`;
  }

  console.log(url);

  location.href = url;
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}
// Fetch GitHub profile data for a specific username
export async function fetchGithubData(username) {
    // Use fetchJSON to request the user's data from the GitHub API
    return fetchJSON(`https://api.github.com/users/${username}`);
}



export function renderProjects(project, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    //goes thru every project (array-projects.json)
    for(let projects of project){
      //create an <article>
      const article = document.createElement('article');
      //adding title image and description to the article
      article.innerHTML = `
        <${headingLevel}>${projects.title}</${headingLevel}>
        <img src="${projects.image}" alt="${projects.title}">
        <p>${projects.description}</p>
      `;
     //add the completed article to the projects container
      containerElement.appendChild(article);
      
    }
}