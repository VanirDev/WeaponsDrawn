import { getGame } from './foundryUtilities.js';
import { WardrobeApplication } from './wardrobeApplication.js';

export class TokenUI {
    static getTokenActor(token: Token): Actor | undefined {
        if (token?.actor?.id)
            return getGame().actors?.get(token.actor.id);
        else 
            return undefined;
    }

    static createButton(): HTMLDivElement {
        let button = document.createElement("div");

        button.classList.add("control-icon");
        button.innerHTML = `<i class="fas fa-tshirt fa-fw"></i>`;
        button.title = "Token Wardrobe";

        return button;
    }

    static buttonEventHandler(event: any, token: Token) {
        if (ui.notifications) ui.notifications.error("You clicked the button!");
    }

    static prepTokenHUD(hud: TokenHUD, html: JQuery, token: Token) {
        const actor = this.getTokenActor(token);
        
        const newButton = this.createButton();

        $(newButton).on(
            "click",
            ((event) => this.buttonEventHandler(event, token))
        )

        html.find("div.left").append(newButton);
    }
}