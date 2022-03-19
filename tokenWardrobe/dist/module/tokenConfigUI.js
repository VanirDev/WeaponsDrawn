import { WardrobeApplication } from "./wardrobeApplication.js";
function createWardrobeButton() {
    let newRow = document.createElement("div");
    newRow.classList.add("form-group");
    newRow.innerHTML = `<button type="button"><i class="fas fa-tshirt fa-fw"></i><label> Token Wardrobe</label></button>`;
    return newRow;
}
function buttonEventHandler(event, data) {
    let wardrobe = new WardrobeApplication({
        msg: "Hiya this is a test!",
        color: "red"
    }, data);
    wardrobe.render(true, { width: 400, height: 300 });
}
export function AddWardrobeConfigButton(app, html, data) {
    console.log(app.object);
    if (app.object instanceof Actor) {
        const newButton = createWardrobeButton();
        $(newButton).on("click", ((event) => buttonEventHandler(event, app.object)));
        html.find("div.tab[data-tab='appearance']").prepend(newButton);
    }
}
