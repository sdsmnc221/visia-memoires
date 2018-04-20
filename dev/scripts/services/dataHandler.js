const DataHandler = {
    textUrl: '../../data/text.txt',
    locationsUrl: '../../data/locations.csv',
    
    getText: async function() {
        let text = await fetch(this.textUrl);
        text = await text.text();
        return text;
    },

    formatText: async function() {
        let text = await this.getText();

        //Add xml tag and root node.
        text = await ['<?xml version="1.0" encoding="UTF-8"?>', '<document>', text, '</document>'].join('');

        //Transform id=XX to id="XX"
        text = await text.replace(/(id=)([0-9]+)(>)/g, ((m, p1, p2, p3, o, str) => [p1,'"', p2, '"', p3].join('')));

        //Parse xml
        let xmlDoc = await new DOMParser().parseFromString(text, 'text/xml'),
            pages = await Array.from(xmlDoc.getElementsByTagName('page'));

        //Format each pages
        let _pages = [];
        console.log(pages);
        pages.forEach(page => {
            let _page = {};
            _page.id = parseInt(page.getAttribute('id'));
            _page.content = page.innerHTML;
            _page.locations = [];
            _page.refs = [];

            _pages.push(_page);
        });

        return _pages;
    }, 

    getLocations: async function() {
        let locations,
            csv = await fetch(this.locationsUrl);
        csv = await csv.text();
        locations = Papa.parse(csv).data;

        return locations;
    },

    formatLocations: async function() {
        let locations = await this.getLocations(),
            props = await locations[0], 
            _location = {},
            _locations = {
                cleaned: [],
                origin: []
            };

        locations.slice(1).forEach((location, index) => {
            location.forEach((e, i) => {
                _location[props[i]] = e;
            });
            
            _locations.origin.push(_location);
            if (!_locations.cleaned.find(e => e.city === _location.city)) {
                _locations.cleaned.push(_location);
            }
            _location = {};
        });
        console.log(_locations);
        return _locations;
    },
};

export { DataHandler };