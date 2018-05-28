import { Page } from "./page";

class BothPages {
    constructor(textNode, mapMarkers) {
        this.text = {
            node: textNode,
            dynamicLocations: null
        }
        this.map = {
            markers: mapMarkers
        }
        this.init();
    }

    init() {
        this.updateDynamicLocations();
    }

    updateDynamicLocations() {
        this.dynamicLocations = this.text.node.querySelectorAll('.content__location');
        if (this.dynamicLocations.length > 0) {
            console.log(this.dynamicLocations);
            this.dynamicLocations.forEach(a => {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    const marker = this.map.markers.find(m => m.options.title === a.getAttribute('title'));
                    if (marker) marker.openPopup();
                })
            });
        }

    }

}

export { BothPages };