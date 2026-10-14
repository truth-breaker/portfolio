import { fetchJSON, renderProjects, fetchGithubData } from './global.js';
//use the fetchJSON function to load all project data  
const projects = await fetchJSON('./projects/lib/projects.json');
//filter the first 3 projects 4 display
const latestProjects = projects.slice(0, 3);
// Select the projects container on the home page
const projectsContainer = document.querySelector('.projects');
// Display the first 3 projects on the home page
renderProjects(latestProjects, projectsContainer, 'h2');
const githubData = await fetchGithubData('truth-breaker');
const profileStats = document.querySelector('#profile-stats');

//check if the profile stats container exists before updating it
if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}
