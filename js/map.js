/* map.js
   Handles map initialization and map event listeners
*/

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3lhbmwiLCJhIjoiY2swNmNoY29kMDA2ZzNjbWN4MmRvbHlmYiJ9.HJHfadzLE1cNqce2G51BEQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/gyanl/cls90czva01au01pld9fc7b5x', // Example style
  center: [2.0, 89.0],
  zoom: 0.5
});

// Load data, add layers, set up cluster layers, etc.
map.on('load', () => {
  // Add source for authors
  map.addSource('authors', {
    type: 'geojson',
    data: 'data.geojson', // Point to your data
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  // Add cluster layer
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'authors',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#67FAAF',
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        15,
        10,
        20,
        20,
        30,
        30,
        40
      ]
    }
  });

  // Add unclustered layer
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'authors',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#67FAAF',
      'circle-radius': 10
    }
  });

  // Handle cluster clicks
  map.on('click', 'clusters', e => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });

    if (!features.length) return;
    const clusterId = features[0].properties.cluster_id;

    map.getSource('authors').getClusterLeaves(
      clusterId,
      103,
      0,
      (err, leaves) => {
        if (err) {
          return console.error('Error getting leaves of cluster:', err);
        }
        // Clear the sidebar, add results, etc.
        clearSidebar();
        setSidebarTitle(leaves.length + ' results');
        leaves.forEach(leaf => {
          addAuthorResult(
            leaf.properties.author_name,
            leaf.properties.city_birth,
            leaf.properties.city_residence,
            leaf.properties.country,
            leaf.properties.year_birth,
            leaf.properties.year_death,
            leaf.properties.work_1,
            leaf.properties.work_2,
            leaf.geometry.coordinates[0],
            leaf.geometry.coordinates[1]
          );
        });
        showSearchResults();
      }
    );
  });

  // Handle click on unclustered points
  map.on('click', 'unclustered-point', e => {
    if (!e.features.length) return;
    const feature = e.features[0];
    const coordinates = feature.geometry.coordinates.slice();

    setSidebarTitle('1 result');
    clearSidebar();
    addAuthorResult(
      feature.properties.author_name,
      feature.properties.city_birth,
      feature.properties.city_residence,
      feature.properties.country,
      feature.properties.year_birth,
      feature.properties.year_death,
      feature.properties.work_1,
      feature.properties.work_2,
      coordinates[0],
      coordinates[1]
    );
    showSearchResults();
  });

  // Adjust map for repeated world copies
  map.on('click', e => {
    const { lngLat } = e;
    while (Math.abs(lngLat.lng - map.getCenter().lng) > 180) {
      lngLat.lng += lngLat.lng > map.getCenter().lng ? 360 : -360;
    }
  });
}); 