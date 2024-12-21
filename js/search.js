/* search.js
   Handles search input behavior, random author button,
   and populating results in the sidebar
*/

// Throttled search logic (uses lodash)
const throttledSearch = _.throttle(searchAndShowResults, 500);

// Set up search bar references
const searchBar = document.querySelector('#search-bar');
const searchInput = searchBar ? searchBar.querySelector('input[type="text"]') : null;
const clearButton = searchBar ? searchBar.querySelector('.search-clear') : null;

// If elements exist, bind events
if (searchInput && clearButton) {
  // Show/hide clear button
  searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value ? 'block' : 'none';
    throttledSearch();
  });

  // Clear search
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    searchInput.focus();
    // Trigger the search update
    throttledSearch();
  });

  // Initialize clear button visibility
  clearButton.style.display = 'none';
}

// Search logic
function searchAndShowResults(e) {
  clearSidebar();
  let features;

  if (searchInput && searchInput.value.length > 1) {
    const searchValue = searchInput.value.toLowerCase();
    features = window.data.features.filter(f =>
      f.properties.author_name.toLowerCase().includes(searchValue) ||
      f.properties.work_1.toLowerCase().includes(searchValue) ||
      f.properties.work_2.toLowerCase().includes(searchValue)
    );
    setSidebarTitle(features.length + ' results');
  } else {
    // If input is too short, just show default text or all features
    setSidebarTitle('Search for your favourite author');
    return;
  }

  // Remove duplicates
  const uniqueFeatures = _.uniqBy(features, f => f.properties.author_name);

  uniqueFeatures.forEach(feature => {
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
  });
}

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