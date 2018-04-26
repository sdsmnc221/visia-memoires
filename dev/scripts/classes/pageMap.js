//Import Classes & Services.
import { Page } from "./page";

class PageMap extends Page {
    constructor(el, data = null) {
        //Build the PageText tree
        super();
        this.page = {
            node: el,
            frame: null,
            frameTapes: null
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
        this.drawTapes();
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
                    {fill: '#f1f1e9', stroke: '#750910', 
                     bowing: -3, roughness: 0.4, 
                     fillStyle: 'hachure', strokeWidth: 1.4,
                     hachureGap: 0.2, curveStepCount: 3});

        frame.node.setAttribute('preserveAspectRatio', 'none');
        frame.node.appendChild(path);
        
    }
    
    drawTapes() {
        this.page.frameTapes = this.page.node.querySelector('#page__map__tapes');
        let frame = SVG(this.page.frameTapes.getAttribute('id')).size(462.64, 700.17),
            viewbox = frame.viewbox(0, 0, 462.64, 700.17),
            tapeColor = 'rgba(196, 145, 123, 0.5)',
            tapePath = [
                '78.4 22.06 22.29 87.06 22.19 80.14 18.62 80.26 18.32 75.72 11.36 79.11 12.91 71.16 8.38 72.53 7.27 68.1 3.78 68.29 4.34 62.41 0 63.1 54.46 0 55.02 6.49 59.52 4.67 58.26 9.91 63.66 8.48 61.88 16.23 66.75 13.04 66.71 16.41 71.07 15.31 67.97 18.85 73.55 19.3 72.52 21.76 78.4 22.06',
                '31.45 610.53 70.91 689.65 65.1 686.83 64.26 690.18 60.38 688.55 61.38 696.4 55.14 691.63 55.09 696.39 51.09 695.55 50.33 698.86 45.57 695.86 44.99 700.16 6.67 623.37 12.24 625.58 11.91 620.66 15.96 624.02 16.2 618.43 22.2 623.34 20.82 617.5 23.63 618.95 23.86 614.46 26.01 618.81 27.86 613.85 29.64 615.84 31.45 610.53',
                '358.16 649.15 447.92 590.42 445.12 597.8 449.14 598.34 447.57 603.23 456.74 600.91 451.67 609.09 457.28 608.48 456.65 613.4 460.62 613.85 457.51 620 462.64 620.08 375.51 677.1 377.62 670.09 371.84 671.19 375.45 665.84 368.84 666.35 374.08 658.44 367.32 660.93 368.79 657.35 363.47 657.7 368.41 654.51 362.39 652.99 364.58 650.57 358.16 649.15',
                '350.46 157.19 448.81 114.38 444.8 121.18 448.68 122.39 446.31 126.95 455.74 126.2 449.36 133.41 455 133.74 453.55 138.5 457.39 139.6 453.3 145.14 458.33 146.08 362.87 187.66 366.12 181.1 360.24 181.21 364.69 176.55 358.1 175.94 364.59 169.02 357.51 170.34 359.56 167.05 354.25 166.51 359.66 164.19 353.98 161.69 356.55 159.67 350.46 157.19'
            ];
        frame.node.setAttribute('preserveAspectRatio', 'none');
        tapePath.forEach(path => {
            frame.polygon(path).fill(tapeColor);
        });
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