//Import Classes & Services.
import { Page } from "./page";

class PageMap extends Page {
    constructor(el, data = null) {
        //Build the PageText tree
        super(el, data);
        this.page = {
            node: el
        }
        this.map = {
            node: this.page.node.querySelector('#map'),
            context: null,
            locations: data
        };

        this.init();
    }

    //Init PageMap
    init() {

        //Load map with GeoPortal's Cassini tile layer
        // Gp.Services.getConfig({
        //     apiKey : '35qs2o9k3xi5ph4olkqp2nt3',
        //     onSuccess : this.loadMap()
        // });   

        //Load map without GeoPortal's services
        this.loadMap(); 
        this.loadMarkers(); 

    }

    loadMap() {
        const baseTile = 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png',
              labelTile = 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png';

        //Load base map (view is set to France - Europe)
        this.map.context = L.map('map', {
            center: [47.3, 2.5],
            zoom: 4.56,
            attributionControl: false,
            zoomControl: false
        })

        //Position Zoom Control to Bottom Right of the map
        new L.Control.Zoom({position: 'bottomright'}).addTo(this.map.context);

        //Load tile layers
        L.tileLayer(baseTile, {maxZoom: 30}).addTo(this.map.context);
        L.tileLayer(labelTile, {maxZoom: 100}).addTo(this.map.context);
        L.geoportalLayer.WMTS({layer: 'GEOGRAPHICALGRIDSYSTEMS.CASSINI'}).addTo(this.map.context);
    }

    loadMarkers() {
        //Create customized markers
        const marker0 = L.icon({
                iconUrl: '../images/common/marker0.svg',
                iconSize: [8, 8],
            }), //P
              marker1 = L.icon({
                iconUrl: '../images/common/marker1.svg',
                iconSize: [8, 8],
            }); //C

        //Load markers
        this.map.locations.origin.forEach(l => {
            new L.marker(
                [parseFloat(l.lat.replace(',', '.')), parseFloat(l.lng.replace(',', '.'))],
                {icon: (l.subject === '0') ? marker0 : marker1}
            ).addTo(this.map.context);
        });
    }

    
}

export { PageMap };