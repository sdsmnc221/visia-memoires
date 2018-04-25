//Import Classes & Services.
import { Page } from "./page";

class PageText extends Page {
    constructor(el, data) {
        //Build the PageText tree
        super(el, data);
        this.page = {
            node: el,
            frame: null,
            data: data
        };
        this.transition = {
            node: this.page.node.querySelector('.book__pages__text__tbox'),
            animation: {className: 'transition', duration: 3000}
        };
        this.content = {
            node: this.page.node.querySelector('#content'),
            text: this.page.data.content
        };
        this.pageInfo = {
            node: this.page.node.querySelector('#pageInfo'),
            indexNode: this.page.node.querySelector('#pageIndex'),
            index: this.page.data.id
        };

        this.init();
    }

    //Init PageText
    init() {
        this.drawFrame();
        this.content.node.innerHTML = this.content.text;
        this.pageInfo.indexNode.innerHTML = this.pageInfo.index;
    }

    drawFrame() {
        this.page.frame = this.page.node.querySelector('#page__text__frame');
        let frame = SVG(this.page.frame.getAttribute('id')).size(466.3, 743.84),
            viewbox = frame.viewbox(0, 0, 466.3, 743.84),
            svg = rough.svg(frame.node),
            path = svg.rectangle(0, 0, 466.3, 743.84, 
                    {fill: '#f1f1e9', stroke: '#4d0910', bowing: 3, roughness: 0.8, fillStyle: 'solid', strokeWidth: 1.2});
        frame.node.setAttribute('preserveAspectRatio', 'none');
        frame.node.appendChild(path);
        
    } 

    initTransition() {
        this.transition.node.classList.remove(this.transition.animation.className);
        this.transition.node.classList.add(this.transition.animation.className);
    }

    //Flip content controller
    flipContent(data) {
        this.initTransition();
        let changeContent = setTimeout(() => {
            this.content.node.innerHTML = data.content;
            this.pageInfo.indexNode.innerHTML = data.id;
        }, this.transition.animation.duration/2),
            stopTransition = setTimeout(() => {
                this.transition.node.classList.remove(this.transition.animation.className);
                clearTimeout(changeContent);
            }, this.transition.animation.duration-400);
        
    }
    
}

export { PageText };