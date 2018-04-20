//Import Classes & Services.
import { Page } from "./page";

class PageText extends Page {
    constructor(el, data) {
        //Build the PageText tree
        super(el, data);
        this.page = {
            node: el,
            data: data
        }
        this.content = {
            node: this.page.node.querySelector('#content'),
            text: this.page.data.content
        };
        this.pageInfo = {
            node: this.page.node.querySelector('#pageInfo'),
            indexNode: this.page.node.querySelector('#pageIndex'),
            index: this.page.data.id
        }

        this.init();
    }

    //Init PageText
    init() {
        this.content.node.innerHTML = this.content.text;
        this.pageInfo.indexNode.innerHTML = this.pageInfo.index;
    }

    //Flip content controller
    flipContent(data) {
        this.content.node.innerHTML = data.content;
        this.pageInfo.indexNode.innerHTML = data.id;
    }
    
}

export { PageText };