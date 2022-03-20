import { OutfitConfigApplication } from "./outfitApplication.js";
import { TokenOutfit } from "./tokenOutfit.js";

function buttonEventHandler(event: any, data:TokenOutfit) {
    let outfitConfigApplication = new OutfitConfigApplication(
        {},
        data
    );
    outfitConfigApplication.render(true, {width:480, height:600});
}

export interface WardrobeOptions {outfits: TokenOutfit[]}

export class WardrobeApplication extends FormApplication<FormApplicationOptions, WardrobeOptions> {
    public wardrobeOptions: WardrobeOptions;
    private actor:Actor;
    
    constructor(wardrobeOptions: WardrobeOptions, actor: Actor) {
        console.log(actor);
        super(wardrobeOptions);
        this.wardrobeOptions = wardrobeOptions;
        this.actor = actor;
    }

    static getWardrobe(actor: Actor) {
        return actor.getFlag("token-wardrobe", "outfits") as TokenOutfit[];
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

    public static bindButton(app: WardrobeApplication, html: JQuery, options:WardrobeOptions) {
        const button = html.find("#createOutfitButton");
        button.on(
            "click",
            ((event) => buttonEventHandler(event, app.object as TokenOutfit))
        )
    }

    protected _updateObject(event: Event, formData?: {exampleInput:string}): Promise<unknown> {
        console.log(formData?.exampleInput);
        return new Promise((resolve, reject) => {resolve(null);});
    }
}