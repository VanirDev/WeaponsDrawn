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
	CONFIG.debug.hooks = true; // For debugging only
	await preloadTemplates();
});

Hooks.once('setup', function () {
});

Hooks.once('ready', function () {
});

Hooks.on('renderTokenConfig', onRenderTokenConfig);
Hooks.on('createCombatant', onCreateCombatant);
Hooks.on('deleteCombatant', onDeleteCombatant);
Hooks.on('createToken', onCreateToken);

function onCreateToken (scene, token, _, userId) {
	if (game.userId !== userId) {
		return;
	}

	updateTokenImg(token._id, false, undefined, scene._id);
}

function onCreateCombatant (combatant, _, userId) {
	if (game.userId !== userId) {
		return;
	}

	try {
		let combat = combatant.parent;
		let token = game.scenes.get(combat.data.scene).tokens.get(combatant.data.tokenId);
		const actorEntity = game.actors.get(token.actor.id);
		const tokenImgPath = getStateTokenImgPath(actorEntity, true);
		updateTokenImg(combatant.data.tokenId, true, tokenImgPath, combat.data.scene);
	} catch (error) {}
	
}

function onDeleteCombatant (combatant, _, userId) {
	if (game.userId !== userId) {
		return;
	}

	try {
		let combat = combatant.parent;
		let token = game.scenes.get(combat.data.scene).tokens.get(combatant.data.tokenId);
		const actorEntity = game.actors.get(token.actor.id);
		const tokenImgPath = getStateTokenImgPath(actorEntity, false);
		updateTokenImg(combatant.data.tokenId, true, tokenImgPath, combat.data.scene);
	} catch (error) {}
	
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

function updateTokenImg (tokenId, inCombat, tokenImgPath, sceneId) {
	tokenImgPath = tokenImgPath == undefined ? getStateTokenImgPath(game.actors.get(game.scenes.get(sceneId).tokens.get(tokenId).data.actorId), inCombat) : tokenImgPath;

	if (game.actors.get(game.scenes.get(sceneId).tokens.get(tokenId).data.actorId).getFlag("WeaponsDrawn", "enabled")) {
		let token = game.scenes.get(sceneId).tokens.get(tokenId);
		token.update({_id: tokenId, img:tokenImgPath});
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
		await new FilePicker({ type:"image", current:idleTokenImage, callback: (path) => {
			html.find($("#WDIdleTokenPathBox")).val(path);
			idleTokenImage = path;
		}}).render(true);
	});
	html.find($('#WDCombatTokenButton')).click(async (ev) => {
		await new FilePicker({ type:"image", current:combatTokenImage, callback: (path) => {
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