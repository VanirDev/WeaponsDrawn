var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddWardrobeConfigButton } from "./module/tokenConfigUI.js";
import { TokenUI } from "./module/tokenUI.js";
import { WardrobeApplication } from "./module/wardrobeApplication.js";
CONFIG.debug.hooks = true;
Hooks.once('init', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("This works!");
}));
Hooks.on("renderTokenHUD", (hud, html, token) => TokenUI.prepTokenHUD(hud, html, token));
Hooks.on("renderWardrobeApplication", (app, html, options) => WardrobeApplication.bindButton(app, html, options));
Hooks.on("renderTokenConfig", (a, b, c) => AddWardrobeConfigButton(a, b, c));
