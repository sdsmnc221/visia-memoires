const DataHandler = {
    textUrl: 'data/text.txt',
    locationsUrl: 'data/locations2.csv',
    xmlUrl: 'data/text.xml',
    
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

    getXml: async function() {
        let text = await fetch(this.xmlUrl);
        text = await text.text();
        return text;
    },

    formatXml: async function() {
        let text = await this.getXml();

        //Parse xml
        let xmlDoc = await new DOMParser().parseFromString(text, 'text/xml'),
            book = {
                info: {}
            };
        
        //Extract Book Info
        let rawInfo = xmlDoc.querySelector('teiHeader');
        book.info.title = rawInfo.querySelector('titleStmt title').textContent.trim();
        book.info.author = rawInfo.querySelector('titleStmt author').textContent.trim();
        book.info.lang = rawInfo.querySelector('langUsage language').getAttribute('ident');
        book.info.date = rawInfo.querySelector('creation date').getAttribute('when');
        book.info.bibl = {};
        book.info.bibl.authors = Array.from(rawInfo.querySelectorAll('bibl author')).map(a => a.textContent.trim());
        book.info.bibl.title = rawInfo.querySelector('bibl title').textContent.trim();
        book.info.bibl.date = rawInfo.querySelector('bibl date').textContent.trim();
        book.info.bibl.publisher = rawInfo.querySelector('bibl publisher').textContent.trim();
        book.info.bibl.ids = Array.from(rawInfo.querySelectorAll('idno'))

        console.log(xmlDoc.getElementsByTagName('text').textContent);
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
            subjectElementIndex = await props.findIndex(e => e === 'subject'),
            _locations = {
                cleaned: [],
                origin: [],
                subjects: {},
            },
            _subjects = [];
        console.log(locations);
        //Get every subjects (duplicated locations excluded)
        locations.slice(1).forEach(location => {
            let _subject = location[subjectElementIndex];
            if (!_locations.subjects.hasOwnProperty(_subject)) {
                _locations.subjects[_subject] = [];
            }
        });
        _subjects = Object.keys(_locations.subjects);

        locations.slice(1).forEach((location, index) => {

            //Origin: Every locations (duplicated locationx INCLUDED)
            //Note that Origin array contains _location (one underscore) object
            let _location = {};
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
            

            //Branching process
            //Subjects: Every locations (duplicated location INCLUDED), separated by
            //subject,  for map's path/directions making
            //Note that each sub-array contains __location (two underscores) object
            let __location = JSON.parse(JSON.stringify(_location));
            delete __location.subject;
            _locations.subjects[_location.subject].push(__location);


            //Cleaning & Merging process
            //Cleaned: Every locations (duplicated location EXCLUDED), for map's markers making
            //Note that Cleaned array contains ___location (three underscores) object

            //if _locations.cleaned do not contain an occurence of the location
            //Then rebuild _location to ___location and push it to Cleaned array
            let occurenceIndex = _locations.cleaned.findIndex(e => e.name === _location.name),
                ___location = JSON.parse(JSON.stringify(_location));
            if (occurenceIndex === -1) {
                //Delete unnecessary keys (page, src, year) (___location)
                Object.keys(___location.bookInfo).forEach(k => delete ___location.bookInfo[k]);
                _subjects.forEach(subject => {
                    ___location.bookInfo[subject] = (___location.subject === subject) ? [_location.bookInfo] : [];
                });
                delete ___location.subject;
                _locations.cleaned.push(___location);
            //else from 2nd occurence: Add up subjects and pages to the already 
            //existed location in _location.cleaned
            } else {
                const occurence = _locations.cleaned[occurenceIndex].bookInfo[___location.subject];
                _locations.cleaned[occurenceIndex].bookInfo[___location.subject] = [...occurence, ___location.bookInfo];
            }


            //Empty _location
            _location = {};
        });

        console.log(_locations);
        return _locations;
    },

    crossData(dText, dLocations) {
        //Array of page objects that will contain array of locations'
        //name appeared on that page (for starters, empty array)
        let _crossData = {},
            subjects = Object.keys(dLocations.subjects); 
        dText.forEach(p => _crossData[p.id] = []);

        //Fill pages with locations' name
        dLocations.cleaned.forEach(l => {
            //Extract all pages where the location appears
            let _l = JSON.parse(JSON.stringify(l)),
                pages = [];
            subjects.forEach(s => {
                pages = [...pages, ..._l.bookInfo[s].map(p => parseInt(p.page, 10)-1)]; //+1 for now...
            });
            //Keep unique occurence
            pages = [...new Set(pages)];
            
            //Fill _crossData[pageID] with location's name
            pages.forEach(p =>{
                if (p in _crossData) {
                    _crossData[p].push(_l.name);
                } else {
                    _crossData[p] = Array.isArray(_crossData[p]) ? [..._crossData[p], _l.name] : [_l.name];
                }
            });
        });
        return _crossData;
    },

    updateTextWithCrossData(dText, dCross) {
        let _updatedText = JSON.parse(JSON.stringify(dText));
        // console.log(_updatedText[8]);
        // console.log(dCross[24]);
        _updatedText.forEach(p => {
            if (dCross[p.id].length > 0) {
                let pattern = `${dCross[p.id].join('|')}`;//`( )(${dCross[p.id].join('|')})([ .;!?'"])`;
                p.content = p.content.replace(new RegExp(pattern, 'g'), (m, p1, p2, p3, o, str) => [`<a title="${m}" href="#" class="content__location">`, m, '</a>'].join(''));
                // if (p.id === 24) {
                //     console.log(pattern);
                //     console.log(p.content);
                //     console.log(toto);
                // }
                // console.log(p.content);
            }
        });
        console.log(_updatedText);
        return _updatedText;
    }
};

export { DataHandler };