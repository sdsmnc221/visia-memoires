const DataHandler = {
    textUrl: 'data/text.txt',
    locationsUrl: 'data/locations.csv',
    
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
                origin: [],
                0: [],
                1: []
            };

        locations.slice(1).forEach((location, index) => {
            location.forEach((e, i) => {
                _location[props[i]] = e;
            });
            _location.coords = [parseFloat(_location.lat.replace(',', '.')), parseFloat(_location.lng.replace(',', '.'))];
            delete _location.lat;
            delete _location.lng;

            _locations.origin.push(_location);
            
            //Cleaning & Merging process :
            //To keep 1 unique occurence of each location
            //if _locations.cleaned already contains an occurence
            //of the location
            const occurenceIndex = _locations.cleaned.findIndex(e => e.city === _location.city);
            //First occurence: Rebuild _location and push it to _location.cleaned
            if (occurenceIndex === -1) {
                _location.pages = {
                    '0': (_location.subject === '0') ? [_location.page] : [],
                    '1': (_location.subject === '1') ? [_location.page] : []
                }
                delete _location.subject;
                delete _location.page;
                _locations.cleaned.push(_location);
            //else from 2nd occurence: Add up subjects and pages to the already 
            //existed location in _location.cleaned
            } else {
                const occurence = _locations.cleaned[occurenceIndex].pages[_location.subject];
                _locations.cleaned[occurenceIndex].pages[_location.subject] = [...occurence, _location.page];
            }

            //Empty _location
            _location = {};
        });

        //Branching process
        _locations.cleaned.forEach(e => {
            console.log(e.pages[1]);
            if (e.pages[0].length > 0) {
                let _e = e;
                _e.pages = _e.pages[0];
                _locations[0].push(_e);
            }
            if (e.pages[1].length > 0) {
                let _e = e;
                _e.pages = _e.pages[1];
                _locations[1].push(_e);
            }
        });

        console.log(_locations);
        return _locations;
    },
};

export { DataHandler };