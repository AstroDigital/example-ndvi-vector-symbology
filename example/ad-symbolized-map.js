'use strict'

/* Function to symbolize each Leaflet vector feature in the collection using a
predefined list of colors. */
const setupLegend = (feature, layer) => {
  /* The NDVI values are represented on a scale of 0-1 while the legend we
  have chosen for this example contains 255 whole-number values, so to compare
  them we need to multiply each field's value by 255. */
  const ndviVal = Math.floor(
    feature.properties.ndvi_values[dateIndex].value * 255);
  // Find the RGB legend properties which match the active field's NDVI value.
  const [r, g, b] = adNdviSymbology[ndviVal];
  /* Define a symbol definition object, where the polygon's fill matches the
  RGB values listed in the legend file, and its outline (color) attribute's RGB
  values are boosted slightly higher to add contrast. */
  const symbology = {
    color: `rgb(${r + 50},${g + 50},${b + 50})`,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
    fillColor: `rgb(${r},${g},${b})`
  };
  // Apply the symbol definition to each field.
  layer.setStyle(symbology);
};

/* Function used to initialize a Leaflet map component with a polygon layer,
as described in detail in Tutorial 1 */
const setupMap = (fieldPolys, mbAccessToken) => {
  const basemapUrl = 'http://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png';
  const map = L.map('map').setView([0, 0], 0);
  L.tileLayer(`${basemapUrl}?access_token=${mbAccessToken}`).addTo(map);
  fieldPolys.addTo(map);
  map.fitBounds(fieldPolys.getBounds());
}



/ !!! PROGRAM BEGINS HERE !!! /

/* This tutorial builds on the basic data preparation and map setup process
as described in Tutorial 1.

This time, while defining the vector feature, we'll set a Mapbox option called
onEachFeature to apply a legend to the polygons based on their characteristics.

Because our data contains NDVI values for several dates, we will need to pick
which date to display. In this exampe, a constant defines the display date as
the 28th date in the index. */
const dateIndex = 27;
let fieldPolys = L.geoJson({
  'type': 'FeatureCollection',
  'features': adNdviData.results.map((field) => {
    const id = field.id;
    field = field.value;
    field.properties.id = id;
    return field;
  })
}, {
  /* This function call, and the function itself, are the only areas where we
  diverge from the more detailed instructions in Tutorial 1. */
  onEachFeature: setupLegend
});

const mbAccessToken = 'pk.eyJ1IjoiYXN0cm9kaWdpdGFsIiwiYSI6ImNVb1B0ZkEifQ.IrJoULY2VMSBNFqHLrFYew';
setupMap(fieldPolys, mbAccessToken);
