/* search.js
   Handles search input behavior, random author button,
   and populating results in the sidebar
*/

// Set up search bar references
const searchBar = document.querySelector('#search-bar');
const searchInput = searchBar ? searchBar.querySelector('input[type="text"]') : null;
const clearButton = searchBar ? searchBar.querySelector('.search-clear') : null;

// If elements exist, bind events
if (searchInput && clearButton) {
  // Show/hide clear button
  searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value ? 'block' : 'none';
  });

  // Clear search
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    searchInput.focus();
    // Trigger the search update
  });

  // Initialize clear button visibility
  clearButton.style.display = 'none';
}

// Search logic
function searchAndShowResults(e) {
  clearSidebar();
  let features;

  if (e && e.type === 'input') {
    e.preventDefault();
    const searchValue = e.target.value.toLowerCase();
    if (searchValue.length > 1) {
      features = window.data.features.filter(f =>
        f.properties.author_name.toLowerCase().includes(searchValue) ||
        f.properties.work_1.toLowerCase().includes(searchValue) ||
        f.properties.work_2.toLowerCase().includes(searchValue)
      );
      setSidebarTitle(features.length + " results");
    } else {
      setSidebarTitle("Search for your favourite author");
      return;
    }
  } else {
    features = map.querySourceFeatures('authors');
  }

  // Remove uniqBy, just show all results
  features.forEach(feature => {
    if (feature.properties) {
      addAuthorResult(
        feature.properties.author_name,
        feature.properties.city_birth,
        feature.properties.city_residence,
        feature.properties.country,
        feature.properties.year_birth,
        feature.properties.year_death,
        feature.properties.work_1,
        feature.properties.work_2,
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      );
    }
  });

  if (!e || e.type !== 'input') {
    setSidebarTitle(features.length + " results");
  }
}

// Remove throttling, just add the direct event listener
document.getElementById('search-bar').addEventListener('input', searchAndShowResults);
map.on('moveend', searchAndShowResults);
map.on('zoomend', searchAndShowResults);

// Random Button
const btnRandom = document.getElementById('btnRandom');
if (btnRandom) {
  btnRandom.addEventListener('click', () => {
    const features = window.data.features;
    if (!features || !features.length) return;
    const randomFeature = features[Math.floor(Math.random() * features.length)];

    if (randomFeature && randomFeature.geometry) {
      map.flyTo({
        center: randomFeature.geometry.coordinates,
        zoom: 5
      });
    }
  });
} 