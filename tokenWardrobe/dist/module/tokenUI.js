import { getGame } from './foundryUtilities.js';
export class TokenUI {
    static getTokenActor(token) {
        var _a, _b;
        if ((_a = token === null || token === void 0 ? void 0 : token.actor) === null || _a === void 0 ? void 0 : _a.id)
            return (_b = getGame().actors) === null || _b === void 0 ? void 0 : _b.get(token.actor.id);
        else
            return undefined;
    }
    static createButton() {
        let button = document.createElement("div");
        button.classList.add("control-icon");
        button.innerHTML = `<i class="fas fa-tshirt fa-fw"></i>`;
        button.title = "Token Wardrobe";
        return button;
    }
    static buttonEventHandler(event, token) {
        if (ui.notifications)
            ui.notifications.error("You clicked the button!");
    }
    static prepTokenHUD(hud, html, token) {
        const actor = this.getTokenActor(token);
        const newButton = this.createButton();
        $(newButton).on("click", ((event) => this.buttonEventHandler(event, token)));
        html.find("div.left").append(newButton);
    }
}
