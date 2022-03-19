export class WardrobeApplication extends FormApplication {
    constructor(wardrobeOptions, actor) {
        super(wardrobeOptions);
        //console.log(token);
        this.wardrobeOptions = wardrobeOptions;
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
    _updateObject(event, formData) {
        console.log(formData === null || formData === void 0 ? void 0 : formData.exampleInput);
        return new Promise((resolve, reject) => { resolve(null); });
    }
}
