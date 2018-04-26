class Page {
    constructor(el = null, data = null) {
        this.page = {
            node: el,
            frame: null,
            index: data
        }
    }

    drawPage() {
        this.page.frame = SVG(this.page.node.getAttribute('id')).size(475.3, 768.92);
        let viewbox = this.page.frame.viewbox(0, 0, 475.3, 768.92),
            svg = rough.svg(this.page.frame.node),
            path = svg.rectangle(0, 0, 467.3, 779.92, 
                    {fill: '#e5e5ca', stroke: '#750910', 
                     bowing: 4, roughness: 0.6, 
                     fillStyle: 'hachure', strokeWidth: 0.6,
                     hachureGap: 0.4, curveStepCount: 3});
        this.page.frame.node.setAttribute('preserveAspectRatio', 'none');
        this.page.frame.node.style.transform += `translate(${this.page.index*4}px, ${this.page.index*2}px) rotate(-${Math.random()*this.page.index}deg) skew(-${Math.random()*this.page.index}deg)`; 
        this.page.frame.node.appendChild(path);
    }
}

export { Page };