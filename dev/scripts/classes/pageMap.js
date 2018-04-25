//Import Classes & Services.
import { Page } from "./page";

class PageMap extends Page {
    constructor(el, data = null) {
        //Build the PageText tree
        super(el, data);
        this.page = {
            node: el,
            frame: null
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
        this.drawFrame();

        //Load map with GeoPortal's Cassini tile layer
        // Gp.Services.getConfig({
        //     apiKey : '35qs2o9k3xi5ph4olkqp2nt3',
        //     onSuccess : this.loadMap()
        // });   

        //Load map without GeoPortal's services
        this.loadMap();
        this.loadPaths(); 
        this.loadMarkers();
        

    }

    drawFrame() {
        this.page.frame = this.page.node.querySelector('#page__map__frame');
        let frame = SVG(this.page.frame.getAttribute('id')).size(497.99, 734.68),
            viewbox = frame.viewbox(0, 0, 497.99, 734.68),
            svg = rough.svg(frame.node),
            path = svg.rectangle(0, 0, 466.3, 743.84, 
                    {fill: '#f1f1e9', stroke: '#4d0910', bowing: -3, roughness: 0.8, fillStyle: 'solid', strokeWidth: 1.2});

        frame.node.setAttribute('preserveAspectRatio', 'none');
        frame.node.appendChild(path);
        
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
        //L.tileLayer(cassiniTile,{maxZoom: 30}).addTo(this.map.context);

        // L.geoportalLayer.WMTS({layer: 'GEOGRAPHICALGRIDSYSTEMS.CASSINI'}).addTo(this.map.context);
    }

    loadMarkers() {
        //Create customized markers
        const marker = L.divIcon({className: 'map__marker', iconSize: [5, 5]}),
              marker0 = L.divIcon({className: 'map__marker map__marker--0', iconSize: [5, 5]}), //P
              marker1 = L.divIcon({className: 'map__marker map__marker--1', iconSize: [5, 5]}), //C
              popupOpts = {className: 'map__popup'};
              

        //Load markers
        this.map.locations.cleaned.forEach(l => {
            const is0 = l.bookInfo[0].length > 0,
                  is1 = l.bookInfo[1].length > 0,
                  icon = (is0 && is1) ? marker : (is0 ? marker0 : marker1),
                  popupTemplate = (l, is0, is1) => {
                      let template = `<h2>${l.name}</h2>`;
                      if (is0) {
                        let years = '';
                        l.bookInfo[0].forEach(e => {
                            years += (e.year !== '') ? `<li><a href="#">${e.year}</a></li>` : '';
                        });
                        template += `<p>Philippe : </p><ul>${years}</ul>`;
                      }
                      if (is1) {
                        let years = '';
                        l.bookInfo[1].forEach(e => {
                            years += (e.year !== '') ? `<li><a href="#">${e.year}</a></li>` : '';
                        });
                        template += `<p>CharLotte : </p><ul>${years}</ul>`;
                      }
                      return template;
                  };
            new L.marker(l.coords, {icon: icon})
                .addTo(this.map.context)
                .bindPopup(popupTemplate(l, is0, is1), popupOpts);
        });
    }

    loadPaths() {
        let path0 = [],
            path1 = [],
            pathOpts = (useRenderer, className, color='') => {
                return  {
                    renderer: useRenderer ? L.Canvas.roughCanvas() : null,
                    roughness: 2,
                    bowing: 3,
                    lineCap: 'round',
                    dashArray: useRenderer ? null : [1, 8],
                    strokeWidth: 0.8,
                    strokeColor: useRenderer ? color : '',
                    className: className
                };
            }
        this.map.locations.subjects[0].forEach(l => {
            path0.push(l.coords);
        });
        this.map.locations.subjects[1].forEach(l => {
            path1.push(l.coords);
        });
        new L.polyline(path0, pathOpts(false, 'map__path map__path--0', 'rgba(61, 39, 117, 0.4)')).addTo(this.map.context);
        new L.polyline(path1, pathOpts(true, 'map__path map__path--1', 'rgba(46, 140, 25, 0.4)')).addTo(this.map.context);
    }
    
}

export { PageMap };