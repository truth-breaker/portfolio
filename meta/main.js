import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));


  return data;
}


function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];

      let { author, date, time, timezone, datetime } = first;

      let ret = {
        id: commit,
        url: 'https://github.com/truth-breaker/portfolio/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: true,
        writable: true,
        enumerable: false,
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3
        .select('#stats')
        .append('dl')
        .attr('class', 'stats');

    // Total lines of code
    dl.append('dt')
        .html('Total <abbr title="Lines of code">LOC</abbr>');

    dl.append('dd')
        .text(data.length);

    // Total commits
    dl.append('dt')
        .text('Total commits');

    dl.append('dd')
        .text(commits.length);

    //Number of files
    const fileCount = d3.group(data, (d) => d.file).size;
    dl.append('dt').text('Files');
    dl.append('dd').text(fileCount);

    // Maximum depth
    const maxDepth = d3.max(data, (d) => d.depth);

    dl.append('dt').text('Max depth');
    dl.append('dd').text(maxDepth);

    // Average line length
    const averageLineLength = d3.mean(data, (d) => d.length);

    dl.append('dt').text('Avg line length');
    dl.append('dd').text(Math.round(averageLineLength));

    // find the time of day when most of work is done

    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => new Date(d.datetime).toLocaleString('en', {
            dayPeriod: 'short'
        }),
    );

    const maxPeriod = d3.greatest(
        workByPeriod,
        (d) => d[1],

    )?.[0];
    
    const cleanPeriod = maxPeriod
    .replace('in the ', '')
    .replace('at ', '');
    
    const formattedPeriod =
    cleanPeriod.charAt(0).toUpperCase() + cleanPeriod.slice(1);
    dl.append('dt').text('Most active time');
    dl.append('dd').text(formattedPeriod);
}


let data = await loadData();
let commits = processCommits(data);
renderCommitInfo(data,commits);
//console.log(commits);

