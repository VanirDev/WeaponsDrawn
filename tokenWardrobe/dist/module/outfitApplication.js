var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function combatVariantCheckboxHandler(event, html) {
}
function changePathHandler(html) {
}
export class OutfitConfigApplication extends FormApplication {
    constructor(outfitConfigOptions, outfit) {
        console.log(outfit);
        super(outfitConfigOptions);
        this.outfitOptions = outfitConfigOptions;
        this.outfitOptions.outfit = outfit;
        if (!outfitConfigOptions.passivePath)
            outfitConfigOptions.passivePath = "icons/svg/mystery-man.svg";
        if (!outfitConfigOptions.combatPath)
            outfitConfigOptions.combatPath = "icons/svg/mystery-man.svg";
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            template: `modules/token-wardrobe/templates/outfitConfigApplication.html`,
            id: `outfit-config-application`,
            title: `Token Outfit`,
            closeOnSubmit: false,
            submitOnChange: true
        });
    }
    getData() {
        console.log("GETTING DATA");
        return this.outfitOptions;
    }
    activateListeners(html) {
        console.log("LISTENERS ACTIVATED");
        super.activateListeners(html);
    }
    _updateObject(event, formData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("OBJECT UPDATED");
            console.log(formData);
            this.outfitOptions.usesCombatVariant = formData.usesCombatVariant;
            let outfit = {
                name: formData.outfitName,
                default: ((_a = this.outfitOptions.outfit) === null || _a === void 0 ? void 0 : _a.default) || false,
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
            };
            this.outfitOptions.outfit = outfit;
            this.render();
        });
    }
}
