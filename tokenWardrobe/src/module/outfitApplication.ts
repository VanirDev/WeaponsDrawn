import { TokenImage, TokenOutfit } from "./tokenOutfit.js";

function combatVariantCheckboxHandler(event:any, html: JQuery) {

}

function changePathHandler(html: JQuery) {

}

export interface OutfitConfigOptions {
    outfit?: TokenOutfit,
    passivePath?: string,
    combatPath?: string,
    usesCombatVariant?: boolean
}

export class OutfitConfigApplication extends FormApplication<FormApplicationOptions, OutfitConfigOptions> {
    public outfitOptions: OutfitConfigOptions;
    
    constructor(outfitConfigOptions: OutfitConfigOptions ,outfit: TokenOutfit) {
        console.log(outfit);
        super(outfitConfigOptions);
        this.outfitOptions = outfitConfigOptions;
        this.outfitOptions.outfit = outfit;
        if (!outfitConfigOptions.passivePath) outfitConfigOptions.passivePath = "icons/svg/mystery-man.svg";
        if (!outfitConfigOptions.combatPath) outfitConfigOptions.combatPath = "icons/svg/mystery-man.svg";
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            template: `modules/token-wardrobe/templates/outfitConfigApplication.html`,
            id: `outfit-config-application`,
            title: `Token Outfit`,
            closeOnSubmit: true,
            submitOnChange: false
        });
    }

    public getData(): OutfitConfigOptions {
        console.log("GETTING DATA");
        return this.outfitOptions;
    }

    activateListeners(html: JQuery<HTMLElement>) {
        console.log("LISTENERS ACTIVATED");
        super.activateListeners(html);
        let combatVariantCheckbox = html.find("[name='usesCombatVariant']");
        let combatVariantImage = html.find("#combatTokenImg");
        let passiveLabel = html.find("#passiveLabel");
        let combatVariantDiv = html.find("#combatVariantDiv");

        combatVariantCheckbox.on("change", function(event) {
            if ($(this).is(":checked")) {
                combatVariantImage.show();
                passiveLabel.show();
                combatVariantDiv.show();
            } else {
                combatVariantImage.hide();
                passiveLabel.hide();
                combatVariantDiv.hide();
            }
        });
    }

    async _updateObject(event: Event, formData: {
        usesCombatVariant: boolean,
        outfitName: string,
        passivePath: string,
        passiveScale: number,
        passiveHorizontallyMirrored: boolean,
        passiveVerticallyMirrored: boolean
        combatPath: string,
        combatScale: number,
        combatHorizontallyMirrored: boolean,
        combatVerticallyMirrored: boolean
    }) {
        console.log("OBJECT UPDATED");
        console.log(formData);
        
        this.outfitOptions.usesCombatVariant = formData.usesCombatVariant;
        let outfit: TokenOutfit = {
            name: formData.outfitName,
            default: this.outfitOptions.outfit?.default || false,
            passive: {
                path: formData.passivePath,
                scale: formData.passiveScale,
                horizontallyMirrored: formData.passiveHorizontallyMirrored,
                verticallyMirrored: formData.passiveVerticallyMirrored
            },
            combat: formData.usesCombatVariant ? {
                path: formData.combatPath,
                scale: formData.combatScale,
                horizontallyMirrored: formData.combatHorizontallyMirrored,
                verticallyMirrored: formData.combatVerticallyMirrored
            } : undefined
        }
        this.outfitOptions.outfit = outfit;

        this.render();
    }
}