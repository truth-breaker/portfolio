import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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
//search var
let query = '';
let searchInput = document.querySelector('.searchBar');

function renderPieChart(projectsGiven) {
    // Group the projects by year and count the projects in each year
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    // Convert the grouped data into the format needed by the pie chart
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // Create the pie-slice information
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);

    // Create the SVG paths for the pie slices
    let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcs = newArcData.map((d) => newArcGenerator(d));

    // Create the color scale
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Select the specific project SVG and remove old paths
    let newSVG = d3.select('#projects-pie-plot');
    newSVG.selectAll('path').remove();

    // Select the legend and remove old legend items
    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();

    // Draw the new pie slices
    newArcs.forEach((arc, idx) => {
        newSVG
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx));
    });

    // Draw the new legend
    newData.forEach((d, idx) => {
        newLegend
            .append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(
                `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`,
            );
    });
}

// Display the complete pie chart when the page first loads
renderPieChart(projects);

// Update the projects, chart, and legend after a search
searchInput.addEventListener('change', (event) => {
    // Update the query value
    query = event.target.value;

    // Search across all project information
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();

        return values.includes(query.toLowerCase());
    });

    // Display only the matching projects
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // Update the pie chart and legend using the matching projects
    renderPieChart(filteredProjects);
});