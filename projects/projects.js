import { fetchJSON, renderProjects } from '../global.js';
// Fetch all project data from projects.json
const projects = await fetchJSON('./lib/projects.json');
// Select the container where the projects will be displayed
const projectsContainer = document.querySelector('.projects');
// Display all projects on the Projects page
renderProjects(projects, projectsContainer, 'h2');
// select the projects page title
const projectsTitle = document.querySelector('.projects-title');
//update the title with the total #of projects
projectsTitle.textContent = `${projects.length} Projects`;