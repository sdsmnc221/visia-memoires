import { Page } from "./page";

class PagesStack {
    constructor(el, min, max) {
        this.stack = {
            node: el,
            pagesNb: null,
            pages: []
        };
        this.initPagesNb(min, max);
        this.drawPages();
    }

    initPagesNb(min, max) {
        let nb = Math.ceil(Math.random()*max);
        while (nb < min) {
            nb = Math.ceil(Math.random()*max);
        }
        this.stack.pagesNb = nb;
    }

    drawPages() {
        for (let i = 0; i < this.stack.pagesNb; i++) {
            let page = new Page(this.stack.node, i);
            page.drawPage();
            this.stack.pages.push(page);
        }
    }
}

export { PagesStack };