export interface WardrobeOptions {msg: string, color: string}

export class WardrobeApplication extends FormApplication<FormApplicationOptions, WardrobeOptions> {
    public wardrobeOptions: WardrobeOptions;
    private actor:Actor;
    
    constructor(wardrobeOptions: WardrobeOptions ,actor: Actor) {
        super(wardrobeOptions);
        this.wardrobeOptions = wardrobeOptions;
        this.actor = actor;
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

    public getData(): WardrobeOptions {
        return this.wardrobeOptions;
    }

    activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);
    }

    protected _updateObject(event: Event, formData?: {exampleInput:string}): Promise<unknown> {
        console.log(formData?.exampleInput);
        return new Promise((resolve, reject) => {resolve(null);});
    }
}