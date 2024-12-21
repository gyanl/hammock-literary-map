/* main.js
   General functions shared across the site
*/

// Sidebar references
const searchtitle = document.getElementById('sidebar-search-title');
const searchtitlecontainer = document.getElementById('sidebar-search-title-container');
const searchresults = document.getElementById('sidebar-search-results');
const sidebarauthortitle = document.getElementById('sidebar-author-title');
const sidebarauthordetails = document.getElementById('sidebar-author-details');
const titlechevron = document.getElementById('chevron');

// Fetch data
fetch('data.geojson')
  .then(response => response.json())
  .then(data => {
    window.data = data;
  })
  .catch(err => console.error('Failed to load data:', err));

// Toggle sidebar display
function toggleSidebar() {
  if (!searchresults) return;
  searchresults.style.display =
    searchresults.style.display === 'none' ? 'block' : 'none';
  if (titlechevron) {
    titlechevron.style.rotate =
      titlechevron.style.rotate === '180deg' ? '0deg' : '180deg';
  }
}

// Set sidebar title
function setSidebarTitle(input) {
  if (searchtitle) {
    searchtitle.innerHTML = input;
  }
}

// Clear sidebar content
function clearSidebar() {
  if (searchresults) {
    searchresults.innerHTML = '';
  }
}

// Show author details
function showAuthorDetails() {
  if (searchtitlecontainer) searchtitlecontainer.style.display = 'none';
  if (searchresults) searchresults.style.display = 'none';
  if (sidebarauthortitle) sidebarauthortitle.style.display = 'flex';
  if (sidebarauthordetails) sidebarauthordetails.style.display = 'block';
}

// Show search results
function showSearchResults() {
  if (searchtitlecontainer) searchtitlecontainer.style.display = 'flex';
  if (searchresults) searchresults.style.display = 'block';
  if (sidebarauthortitle) sidebarauthortitle.style.display = 'none';
  if (sidebarauthordetails) sidebarauthordetails.style.display = 'none';
}

// Go back to the results
function backToTheResults() {
  showSearchResults();
  map.flyTo({ zoom: 3 });
}

// Dynamically add an author result to the sidebar
function addAuthorResult(
  name,
  city_birth,
  city_residence,
  country,
  year_birth,
  year_death,
  work1,
  work2,
  lat,
  long
) {
  const result = document.createElement('div');
  result.className = 'author-result';

  // Construct your HTML for an author
  result.innerHTML = `
    <h3>${name}</h3>
    <p>Birth: ${city_birth}, ${country} in ${year_birth}</p>
    <p>Key works: ${work1}, ${work2}</p>
    <button class="button-primary" onclick="focusAuthor(${lat}, ${long})">
      Focus
    </button>
  `;

  searchresults.appendChild(result);
}

// Focus on the author in the map
function focusAuthor(lat, long) {
  map.flyTo({
    center: [lat, long],
    zoom: 5
  });
  showAuthorDetails();
} 