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
        this.loadPaths();

    }

    loadMap() {
        const baseTile = 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png',
              labelTile = 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
              cassiniTile = 'http://wxs.ign.fr/35qs2o9k3xi5ph4olkqp2nt3/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=GEOGRAPHICALGRIDSYSTEMS.BONNE&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&format=image/jpeg&style=normal';
            //   http://wxs.ign.fr/35qs2o9k3xi5ph4olkqp2nt3/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=GEOGRAPHICALGRIDSYSTEMS.MAPS&format=image/jpeg&style=normal
            //ORTHOIMAGERY.ORTHOPHOTOS

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
        L.tileLayer(labelTile, {maxZoom: 30}).addTo(this.map.context);
        L.tileLayer(cassiniTile,{maxZoom: 30}).addTo(this.map.context);

        // L.geoportalLayer.WMTS({layer: 'GEOGRAPHICALGRIDSYSTEMS.CASSINI'}).addTo(this.map.context);
    }

    loadMarkers() {
        //Create customized markers
        const marker = L.divIcon({className: 'map__marker'}),
              marker0 = L.divIcon({className: 'map__marker map__marker--0'}), //P
              marker1 = L.divIcon({className: 'map__marker map__marker--1'}); //C
              

        //Load markers
        this.map.locations.cleaned.forEach(l => {
            const is0 = l.pages[0].length > 0,
                  is1 = l.pages[1].length > 0,
                  icon = (is0 && is1) ? marker : (is0 ? marker0 : marker1);
            new L.marker(l.coords,{icon: icon}).addTo(this.map.context);
        });
    }

    loadPaths() {
        const subjects = [0, 1];
    }

    
}

export { PageMap };