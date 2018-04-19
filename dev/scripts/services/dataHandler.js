const DataHandler = {
    textUrl: '../../data/text.txt',
    locationsUrl: 'b',
    
    getText: async function() {
        let text = await fetch(this.textUrl);
        text = await text.text();
        return text;
    },

    formatText: async function() {
        let text = await this.getText();

        //add xml tag and root node
        text = await ['<?xml version="1.0" encoding="UTF-8"?>', '<document>', text, '</document>'].join('');

        //transform id=XX to id="XX"
        text = await text.replace(/(id=)([0-9]+)(>)/g, ((m, p1, p2, p3, o, str) => [p1,'"', p2, '"', p3].join('')));

        //parse xml
        let xmlDoc = await new DOMParser().parseFromString(text, 'text/xml'),
            pages = await Array.from(xmlDoc.getElementsByTagName('page'));

        //format each pages
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
    }
};

export { DataHandler };