import { DataHandler } from './services/dataHandler';

window.onload = () => {
    const APP = new App(document.querySelector('.app'));
};

class App {
    constructor(el) {
        this.app = el;
        this.init();
    }

    init() {
        DataHandler.formatText()
            .then(data => {
                this.app.pageText = this.app.querySelector('.book__pages__text');
                this.app.pageText.content = this.app.pageText.querySelector('#content');
                this.app.pageText.pageInfo = this.app.pageText.querySelector('#pageInfo');
                this.app.pageText.pageInfo.index = this.app.pageText.querySelector('#pageIndex');
                this.app.pages = {
                    min: data[0].id,
                    max: data[data.length-1].id,
                    currentPage: data[0]
                }
                this.app.pageText.pageInfo.index.innerHTML = this.app.pages.currentPage.id;
                this.app.pageText.content.innerHTML = this.app.pages.currentPage.content;     
                

                this.flipPage = (e) => {
                    switch (e.keyCode) {
                        case 37: //Arrow Left
                            this.app.pages.currentPage = data.find(p => p.id === this.app.pages.currentPage.id-1);
                            this.app.pageText.pageInfo.index.innerHTML = this.app.pages.currentPage.id;
                            this.app.pageText.content.innerHTML = this.app.pages.currentPage.content; 

                            break;
                        case 39: //Arrow Right
                            this.app.pages.currentPage = data.find(p => p.id === this.app.pages.currentPage.id+1);
                            this.app.pageText.pageInfo.index.innerHTML = this.app.pages.currentPage.id;
                            this.app.pageText.content.innerHTML = this.app.pages.currentPage.content; 

                        default:
                            break;
                    }
                }

                window.addEventListener('keydown', this.flipPage);
            })
    }
}
