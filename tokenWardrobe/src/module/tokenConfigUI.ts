import { WardrobeApplication } from "./wardrobeApplication.js";

function createWardrobeButton():HTMLDivElement {
    let newRow = document.createElement("div");

    newRow.classList.add("form-group");
    newRow.innerHTML = `<button type="button"><i class="fas fa-tshirt fa-fw"></i><label> Token Wardrobe</label></button>`

    return newRow;
}

function buttonEventHandler(event: any, data:Actor) {
    let wardrobe = new WardrobeApplication(
        {outfits: WardrobeApplication.getWardrobe(data)}, 
        data
    );
    wardrobe.render(true, {width: 480});
}

export function AddWardrobeConfigButton(app:FormApplication, html:JQuery, data:object) {
    if (app.object instanceof Actor) {
        const newButton = createWardrobeButton()

        $(newButton).on(
            "click",
            ((event) => buttonEventHandler(event, app.object as Actor))
        )

        html.find("div.tab[data-tab='appearance']").prepend(newButton);
    }
}