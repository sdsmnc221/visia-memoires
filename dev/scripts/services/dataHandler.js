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
                subjects: {0: [], 1: []}
            };

        locations.slice(1).forEach((location, index) => {
            //Origin
            //_location
            location.forEach((e, i) => {
                _location[props[i]] = e;
            });
            _location.name = _location.city;
            _location.bookInfo = {
                page: _location.page,
                src: _location.src,
                year: _location.year
            };
            _location.coords = [parseFloat(_location.lat.replace(',', '.')), parseFloat(_location.lng.replace(',', '.'))];
            delete _location.city;
            delete _location.page;
            delete _location.src;
            delete _location.year;
            delete _location.lat;
            delete _location.lng;
            _locations.origin.push(_location);
            
            //Cleaning & Merging process 
            //__location
            //To keep 1 unique occurence of each location 
            //if _locations.cleaned already contains an 
            //occurence of the location
            let occurenceIndex = _locations.cleaned.findIndex(e => e.name === _location.name),
                __location = JSON.parse(JSON.stringify(_location));
            //First occurence: Rebuild _location and push it to _location.cleaned
            if (occurenceIndex === -1) {
                __location.bookInfo = {
                    0: (__location.subject === '0') ? [__location.bookInfo] : [],
                    1: (__location.subject === '1') ? [__location.bookInfo] : []
                }
                delete __location.subject;
                _locations.cleaned.push(__location);
            //else from 2nd occurence: Add up subjects and pages to the already 
            //existed location in _location.cleaned
            } else {
                const occurence = _locations.cleaned[occurenceIndex].bookInfo[__location.subject];
                _locations.cleaned[occurenceIndex].bookInfo[__location.subject] = [...occurence, __location.bookInfo];
            }

            //Empty _location
            _location = {};
        });

        //Branching process
        _locations.cleaned.forEach(e => {
            if (e.bookInfo[0].length > 0) {
                let _e = JSON.parse(JSON.stringify(e));
                _e.bookInfo = e.bookInfo[0];
                _locations.subjects[0].push(_e);
            }
            if (e.bookInfo[1].length > 0) {
                let _e = JSON.parse(JSON.stringify(e));
                _e.bookInfo = e.bookInfo[1];
                _locations.subjects[1].push(_e);
            }
        });

        console.log(_locations);
        return _locations;
    },
};

export { DataHandler };