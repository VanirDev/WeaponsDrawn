import { OutfitConfigApplication } from "./outfitApplication.js";
function buttonEventHandler(event, data) {
    let outfitConfigApplication = new OutfitConfigApplication({}, data);
    outfitConfigApplication.render(true, { width: 480 });
}
export class WardrobeApplication extends FormApplication {
    constructor(wardrobeOptions, actor) {
        console.log(actor);
        super(wardrobeOptions);
        this.wardrobeOptions = wardrobeOptions;
        this.actor = actor;
    }
    static getWardrobe(actor) {
        return actor.getFlag("token-wardrobe", "outfits");
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            template: `modules/token-wardrobe/templates/wardrobeApplication.html`,
            id: `wardrobe-application`,
            title: `Token Wardrobe`,
            closeOnSubmit: true
        });
    }
    getData() {
        return this.wardrobeOptions;
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    static bindButton(app, html, options) {
        const button = html.find("#createOutfitButton");
        button.on("click", ((event) => buttonEventHandler(event, app.object)));
    }
    _updateObject(event, formData) {
        console.log(formData === null || formData === void 0 ? void 0 : formData.exampleInput);
        return new Promise((resolve, reject) => { resolve(null); });
    }
}
