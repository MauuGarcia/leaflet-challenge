
// Inicialización del mapa
const earthquakeMap = L.map("map", {
    center: [37.09, -95.71], // Coordenadas centrales (EE. UU.)
    zoom: 5
});

// Añadir capa de mosaico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(earthquakeMap);

// URL de datos de terremotos
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Obtener datos de terremotos y crear características
d3.json(earthquakeURL).then(geoData => {
    plotEarthquakes(geoData.features);
});

// Función para procesar datos de terremotos y añadirlos al mapa
function plotEarthquakes(features) {
    features.forEach(event => {
        const magnitude = event.properties.mag;
        const depth = event.geometry.coordinates[2];
        const location = [event.geometry.coordinates[1], event.geometry.coordinates[0]];

        // Estilo del marcador
        const markerRadius = magnitude * 4000; // Radio ajustado
        const markerColor = depth > 60 ? '#ff5733' : depth > 40 ? '#ffbd33' : '#75ff33';

        // Crear marcador circular
        L.circle(location, {
            fillOpacity: 0.8,
            color: 'black',
            fillColor: markerColor,
            radius: markerRadius
        }).addTo(earthquakeMap).bindPopup(`
            <h3>${event.properties.place}</h3>
            <hr>
            <p><strong>Magnitude:</strong> ${magnitude}<br>
            <strong>Depth:</strong> ${depth} km</p>
        `);
    });

    // Añadir leyenda
    addLegend();
}

// Función para añadir una leyenda al mapa
function addLegend() {
    const legendControl = L.control({ position: 'bottomleft' });

    legendControl.onAdd = function () {
        const legendDiv = L.DomUtil.create('div', 'info legend');
        const depthRanges = [0, 40, 60];
        const colors = ['#75ff33', '#ffbd33', '#ff5733'];

        // Crear elementos de la leyenda
        for (let i = 0; i < depthRanges.length; i++) {
            legendDiv.innerHTML += `
                <i style="background:${colors[i]}"></i> 
                ${depthRanges[i]}${depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + ' km<br>' : '+ km'}
            `;
        }
        return legendDiv;
    };

    legendControl.addTo(earthquakeMap);
}
