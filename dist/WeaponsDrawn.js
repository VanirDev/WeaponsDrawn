/**
 * Author: Vanir#0001 (Discord) | github.com/VanirDev
 * Software License: Creative Commons Attributions International License
 */

 import { registerSettings } from './module/settings.js';
 import { preloadTemplates } from './module/preloadTemplates.js';
 
 const defaultIcon = 'icons/svg/mystery-man.svg';
 
 Hooks.once('init', async function () {
	 console.log('Weapons Drawn | Initializing WeaponsDrawn');
	 registerSettings();
	 //CONFIG.debug.hooks = true; // For debugging only
	 await preloadTemplates();
 });
 
 Hooks.on('renderTokenConfig', onRenderTokenConfig);
 window.Hooks.on("deleteCombat", function (arg1) {
	 if (arg1.data) {
		toggleImage(false, arg1.data._source.combatants, arg1.data.scene);
	 }
 });
 window.Hooks.on("deleteCombatant", function (arg1, arg2, arg3) {
	 if (arg1.data) {
		toggleImage(false, [arg1.data._source], arg1._token.parent.data._id);
	 }
 });
 window.Hooks.on("createToken", function (arg1, arg2, arg3) {
	if (arg1.data) {
		let combatantsList = {
			actorId: arg1.data.actorId,
			tokenId: arg1.data._id
		}
		toggleImage(false, [combatantsList], arg1.parent.data._id);
	}
});

 window.Hooks.on("renderCombatTracker", function (arg1, arg2, arg3) {
	 if (arg3?.combat?.data) {
		toggleImage(true, arg3.combat.data._source.combatants, arg3.combat.data.scene);
	 }
 });
 
 function toggleImage(isCombat, combatantsList, sceneId) {
	if (!game.user.isGM) {
		return;
	}

	for (let i = 0; i < combatantsList.length; i++) {
		const actorId = combatantsList[i].actorId;	   
		const actorEntity = game.actors.get(actorId);
		const tokenImgPath = getStateTokenImgPath(actorEntity, isCombat);
		updateTokenImg(combatantsList[i].tokenId, isCombat, tokenImgPath, sceneId, actorEntity);
	}
}
 
 function getStateTokenImgPath (actorEntity, inCombat) {
	 let idleTokenImage = "";
	 let combatTokenImage = "";
 
	 if (actorEntity.data.flags.hasOwnProperty("WeaponsDrawn")) {
		 idleTokenImage = actorEntity.getFlag("WeaponsDrawn", "idle");
		 combatTokenImage = actorEntity.getFlag("WeaponsDrawn", "combat");
	 }
	 if (idleTokenImage == "" || idleTokenImage == undefined) {
		 idleTokenImage = actorEntity.data.img;
		 if (combatTokenImage == "" || combatTokenImage == undefined) {
			 combatTokenImage = idleTokenImage;
		 }
	 }
 
	 return inCombat ? combatTokenImage : idleTokenImage;
 }
 
 function updateTokenImg (tokenId, inCombat, tokenImgPath, sceneId, actorEntity) {
	 if (actorEntity.getFlag("WeaponsDrawn", "enabled")) {
		 game.scenes.get(sceneId).updateEmbeddedEntity("Token", {_id: tokenId, img:tokenImgPath});
	 }
 }
 
 function onRenderTokenConfig (tokenConfig, html) {
	 const tokenImageDiv = html.find($("input.image")).parent().parent();
	 const saveButton = html.find($('button[name="submit"]'))
	 let actorEntity = game.actors.get(tokenConfig.actor.data._id);
	 console.log(tokenImageDiv.parent());
 
	 let idleTokenImage = "";
	 let combatTokenImage = "";
	 let wdEnabled = false;
 
	 if (actorEntity.data.flags.hasOwnProperty("WeaponsDrawn")) {
		 idleTokenImage = actorEntity.getFlag("WeaponsDrawn", "idle");
		 combatTokenImage = actorEntity.getFlag("WeaponsDrawn", "combat");
		 wdEnabled = actorEntity.getFlag("WeaponsDrawn", "enabled");
	 }
	 if (idleTokenImage == "" || idleTokenImage == undefined) {
		 idleTokenImage = actorEntity.data.img;
		 if (combatTokenImage == "" || combatTokenImage == undefined) {
			 combatTokenImage = idleTokenImage;
		 }
	 }
 
	 idleTokenImage = idleTokenImage == "" || idleTokenImage == undefined ? defaultIcon : idleTokenImage;
	 combatTokenImage = combatTokenImage == "" || combatTokenImage == undefined ? defaultIcon : combatTokenImage;
	 
	 html.find($('label:contains("Token Image Path:")')).text("Default Token Image:");
	 
	 const headerHTML = 
		 `<div class="form-group">
			 <label>Enable Weapons Drawn Tokens:</label>
			 <input id="WDEnableCheckbox" type="checkbox" name="enableWeaponsDrawn" data-dtype="Boolean">
		 </div>`;
 
	 const defaultIconHTML = 
		 `<div class="form-group">
			 <label>Out of Combat Token Image:</label>
			 <div class="form-fields">
				 <button id="WDIdleTokenButton" type="button" class="file-picker" data-type="imagevideo" data-target="imgIdle" title="Browse Files" tabindex="-1">
					 <i class="fas fa-file-import fa-fw">
					 </i>
				 </button>
				 <input id="WDIdleTokenPathBox" class="image" type="text" name="imgIdle" placeholder="path/image.png" value="${idleTokenImage}" value="">
			 </div>
		 </div>`;
 
	 const combatIconHTML = 
		 `<div class="form-group">
			 <label>In Combat Token Image:</label>
			 <div class="form-fields">
				 <button id="WDCombatTokenButton" type="button" class="file-picker" data-type="imagevideo" data-target="imgCombat" title="Browse Files" tabindex="-1">
					 <i class="fas fa-file-import fa-fw">
					 </i>
				 </button>
				 <input id="WDCombatTokenPathBox" class="image" type="text" name="imgCombat" placeholder="path/image.png" value="${combatTokenImage}" value="">
			 </div>
		 </div>`;
 
	 tokenImageDiv.before(headerHTML);
	 tokenImageDiv.before(defaultIconHTML);
	 tokenImageDiv.before(combatIconHTML);
 
	 if (!wdEnabled) {
		 tokenImageDiv.prev().prev().hide();
		 tokenImageDiv.prev().hide();
		 tokenImageDiv.show()
	 } else {
		 html.find($('input#WDEnableCheckbox')).prop('checked', true);
		 tokenImageDiv.hide();
	 }
 
	 html.find($('#WDIdleTokenButton')).click(async (ev) => {
		 await new FilePicker({ type:"imagevideo", current:idleTokenImage, callback: (path) => {
			 html.find($("#WDIdleTokenPathBox")).val(path);
			 idleTokenImage = path;
		 }}).render(true);
	 });
	 html.find($('#WDCombatTokenButton')).click(async (ev) => {
		 await new FilePicker({ type:"imagevideo", current:combatTokenImage, callback: (path) => {
			 html.find($("#WDCombatTokenPathBox")).val(path);
			 combatTokenImage = path;
		 }}).render(true);
	 });
	 html.find($('input#WDEnableCheckbox')).change(function() {
		 wdEnabled = html.find($('input#WDEnableCheckbox')).is(":checked");
		 console.log(wdEnabled);
		 if (!wdEnabled) {
			 tokenImageDiv.prev().prev().hide();
			 tokenImageDiv.prev().hide();
			 tokenImageDiv.show();
		 } else {
			 tokenImageDiv.prev().prev().show();
			 tokenImageDiv.prev().show();
			 tokenImageDiv.hide();
		 }
	 });
	 saveButton.bind("click", async function() {
		 await actorEntity.setFlag("WeaponsDrawn", "idle", idleTokenImage);
		 await actorEntity.setFlag("WeaponsDrawn", "combat", combatTokenImage);
		 await actorEntity.setFlag("WeaponsDrawn", "enabled", wdEnabled);
 
		 if (!wdEnabled) {
			 return;
		 }
 
		 let inCombatTokens = [];
		 let idleTokens = [];
		 game.combats.forEach((combat, combatKey) => {
			 combat = game.combats.get(combatKey);
			 if (combat.data.active) {
				 combat.data.combatants.forEach(combatant => {
					 if (combatant.actor.data._id == actorEntity.data._id) {
						 combat.updateCombatant({_id:combatant._id, img: combatTokenImage});
						 updateTokenImg(combatant.token._id, true, combatTokenImage, combat.data.scene);
						 inCombatTokens.push(combatant.token._id);
					 }
				 });
			 }
		 });
		 
		 game.scenes.forEach((scene, sceneKey) => {
			 scene.data.tokens.forEach(token => {
				 if (token.actorId == actorEntity.data._id && !inCombatTokens.includes(token._id)) {
					 console.log(idleTokenImage);
					 updateTokenImg(token._id, false, idleTokenImage, sceneKey);
					 idleTokens.push(token._id);
				 }
			 })
		 })
	 });
 }