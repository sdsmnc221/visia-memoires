//Import Classes & Services.
import { DataHandler } from './services/dataHandler';
import { Page } from './classes/page';
import { PageText } from './classes/pageText';
import { PageMap } from './classes/pageMap';

//Once document is ready, init the app (the book).
window.onload = () => {
    const _app = new App(document.querySelector('.app'));
};

//_app's core
class App {
    constructor(el) {
        this.app = el;
        this.init();
    }

    init() {
        //Fetch Formatted data then init the app with it.
        Promise.all([DataHandler.formatText(), DataHandler.formatLocations()])
            .then(res => {
                const data = res[0],
                      locations = res[1];
                //Build the app tree.
                this.app.pages = {
                    blankPages: Array.from(this.app.querySelectorAll('.book__pages__page'))
                        .filter(p => !p.classList.contains('book__pages__text') && !p.classList.contains('book__pages__map')),
                    text: new PageText(this.app.querySelector('.book__pages__text'), data[0]),
                    map: new PageMap(this.app.querySelector('.book__pages__map'), locations),
                    info: {
                        min: data[0].id,
                        max: data[data.length-1].id,
                        currentPage: data[0]
                    }
                };
                this.app.pages.info.currentPage = this.app.pages.text.page.data;

                this.initFlipContent(this.app, data);

            
            });
    }

    //Init flip content behaviour:
    //This behaviour is based on keyboard navigation (< >)
    //Once < or > is pressed, the data of the next or current page
    //will flow to the PageText throught PageText.flipContent(data).
    initFlipContent(_app, _data) {
        const flipContent = (e) => {
            _app.pages.text.initTransition();
            switch (e.keyCode) {
                case 37: //Arrow Left
                    //Flip to previous page if and only if previous page >= min pages
                    if (_app.pages.info.currentPage.id-1 >= _app.pages.info.min) {
                        let previousPage = _data.find(p => p.id === _app.pages.info.currentPage.id-1) || _app.pages.info.currentPage;
                        _app.pages.info.currentPage = previousPage;
                        _app.pages.text.flipContent(previousPage);
                    }
                    break;

                case 39: //Arrow Right
                    //Flip to previous page if and only if next page <= max pages
                    if (_app.pages.info.currentPage.id+1 <= _app.pages.info.max) {
                        let nextPage = _data.find(p => p.id === _app.pages.info.currentPage.id+1) || _app.pages.info.currentPage;
                        _app.pages.info.currentPage = nextPage;
                        _app.pages.text.flipContent(nextPage);
                    }
                default:
                    break;
            }
        }
        window.addEventListener('keydown', flipContent);
    }
}
