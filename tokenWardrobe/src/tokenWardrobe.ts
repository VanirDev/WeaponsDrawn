import { AddWardrobeConfigButton } from "./module/tokenConfigUI.js";
import { TokenUI } from "./module/tokenUI.js";

CONFIG.debug.hooks = true;

Hooks.once('init', async () => {
    console.log("This works!");
});

Hooks.on("renderTokenHUD", (hud: TokenHUD, html: JQuery, token: Token) => TokenUI.prepTokenHUD(hud, html, token));

Hooks.on("renderTokenConfig", (a:any, b:any, c:any) => AddWardrobeConfigButton(a,b,c));