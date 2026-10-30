import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch all project data from projects.json
const projects = await fetchJSON('./lib/projects.json');

// Select the container where the projects will be displayed
const projectsContainer = document.querySelector('.projects');

// Display all projects on the Projects page
renderProjects(projects, projectsContainer, 'h2');

// Select the Projects page title
const projectsTitle = document.querySelector('.projects-title');

// Update the title with the total number of projects
projectsTitle.textContent = `${projects.length} Projects`;

// Search variables
let query = '';
let searchInput = document.querySelector('.searchBar');

// -1 means no pie wedge is selected
let selectedIndex = -1;


// Create and render the pie chart
function renderPieChart(projectsGiven) {

    // Group the projects by year and count the projects in each year
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    // Convert the grouped data into the format needed for the pie chart
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // Create the pie-slice information
    let newSliceGenerator = d3.pie().value((d) => d.value);

    let newArcData = newSliceGenerator(newData);

    // Create the SVG paths for the pie slices
    let newArcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);

    let newArcs = newArcData.map((d) => newArcGenerator(d));

    // Create the color scale
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Select the pie chart SVG
    let svg = d3.select('#projects-pie-plot');

    // Remove old pie slices before drawing new ones
    svg.selectAll('path').remove();

    // Select the legend
    let legend = d3.select('.legend');

    // Remove old legend items
    legend.selectAll('li').remove();


    // Draw the pie slices
  newArcs.forEach((arc, i) => {
    svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            // Select this wedge, or deselect it if it is clicked again
            selectedIndex = selectedIndex === i ? -1 : i;

            // Apply the selected class to the matching wedge
            svg
                .selectAll('path')
                .attr('class', (_, idx) =>
                    idx === selectedIndex ? 'selected' : '',
                );

            // Apply the selected class to the matching legend item
            legend
                .selectAll('li')
                .attr('class', (_, idx) =>
                    idx === selectedIndex
                        ? 'legend-item selected'
                        : 'legend-item',
                );

            // If no wedge is selected, display all projects
            if (selectedIndex === -1) {
                renderProjects(projectsGiven, projectsContainer, 'h2');
            } else {
                // Get the year represented by the selected wedge
                let selectedYear = newData[selectedIndex].label;

                // Keep only projects from the selected year
                let selectedProjects = projectsGiven.filter(
                    (project) => project.year === selectedYear,
                );

                // Display the projects from the selected year
                renderProjects(
                    selectedProjects,
                    projectsContainer,
                    'h2',
                );
            }
        });
});


    // Draw the legend
    newData.forEach((d, idx) => {
        legend
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


// Update projects, pie chart, and legend when searching
searchInput.addEventListener('input', (event) => {

    // Update the query value
    query = event.target.value;

    // Search across all project information
    let filteredProjects = projects.filter((project) => {

        let values = Object.values(project)
            .join('\n')
            .toLowerCase();

        return values.includes(query.toLowerCase());
    });

    // Display the matching projects
    renderProjects(
        filteredProjects,
        projectsContainer,
        'h2',
    );

    // Reset selected wedge when search changes
    selectedIndex = -1;

    // Update pie chart and legend
    renderPieChart(filteredProjects);
});