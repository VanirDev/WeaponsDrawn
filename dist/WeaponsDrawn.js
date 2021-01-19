/**
 * Author: Vanir#0001 (Discord) | github.com/VanirDev
 * Software License: Creative Commons Attributions International License
 */

// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { DND5E } from "../../systems/dnd5e/module/config.js";

/* ------------------------------------ */
/* CONSTANTS							*/
/* ------------------------------------ */
const defaultIcon = 'icons/svg/mystery-man.svg';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
	console.log('Weapons Drawn | Initializing WeaponsDrawn');
	// Assign custom classes and constants here

	// Register custom module settings
	registerSettings();
	//CONFIG.debug.hooks = true; // For debugging only
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
	// Do anything after initialization but before ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
	// Do anything once the module is ready
});

Hooks.on('renderTokenConfig', onRenderTokenConfig);
Hooks.on('createCombatant', onCreateCombatant);
Hooks.on('deleteCombatant', onDeleteCombatant);
Hooks.on('createToken', onCreateToken);

function onCreateToken (scene, token, _, userId) {
	if (game.userId !== userId) {
		// Only act if we initiated the update ourselves
		return;
	}

	updateTokenImg(token._id, false, undefined, scene._id);
}

function onCreateCombatant (combat, combatant, _, userId) {
	if (game.userId !== userId) {
		// Only act if we initiated the update ourselves
		return;
	}

	let token = game.scenes.get(combat.data.scene).getEmbeddedEntity("Token", combatant.tokenId);
	//console.log(JSON.stringify(token));
	const actorEntity = game.actors.get(token.actorId);
	const tokenImgPath = getStateTokenImgPath(actorEntity, true);
	combat.updateCombatant({_id:combatant._id, img: tokenImgPath});
	updateTokenImg(token._id, true, tokenImgPath, combat.data.scene);
}

function onDeleteCombatant (combat, combatant, _, userId) {
	if (game.userId !== userId) {
		// Only act if we initiated the update ourselves
		return;
	}

	const actorEntity = game.actors.get(combatant.actor.data._id);
	const tokenImgPath = getStateTokenImgPath(actorEntity, false);
	updateTokenImg(combatant.token._id, true, tokenImgPath, combat.data.scene);
}

function getStateTokenImgPath (actorEntity, inCombat) {
	let idleTokenImage = "";
	let combatTokenImage = "";

	if (actorEntity.data.flags.hasOwnProperty("WeaponsDrawn")) {
		idleTokenImage = actorEntity.getFlag("WeaponsDrawn", "idle");
		combatTokenImage = actorEntity.getFlag("WeaponsDrawn", "combat");
		// console.log(idleTokenImage);
		// console.log(combatTokenImage);
	}
	if (idleTokenImage == "" || idleTokenImage == undefined) {
		idleTokenImage = actorEntity.data.img;
		if (combatTokenImage == "" || combatTokenImage == undefined) {
			combatTokenImage = idleTokenImage;
		}
	}

	// console.log(idleTokenImage);
	// console.log(combatTokenImage);
	return inCombat ? combatTokenImage : idleTokenImage;
}

function updateTokenImg (tokenId, inCombat, tokenImgPath, sceneId) {
	tokenImgPath = tokenImgPath == undefined ? getStateTokenImgPath(game.actors.get(game.scenes.get(sceneId).getEmbeddedEntity("Token", tokenId).actorId), inCombat) : tokenImgPath;
	// console.log(tokenId);
	// console.log(sceneId);
	if (game.actors.get(game.scenes.get(sceneId).getEmbeddedEntity("Token", tokenId).actorId).getFlag("WeaponsDrawn", "enabled")) {
		game.scenes.get(sceneId).updateEmbeddedEntity("Token", {_id: tokenId, img:tokenImgPath});
	}
}

function onRenderTokenConfig (tokenConfig, html) {
	const tokenImageDiv = $("input.image").parent().parent();
	const saveButton = $('button[name="submit"]')
	let actorEntity = game.actors.get(tokenConfig.actor.data._id);
	console.log(tokenImageDiv.parent());
	// console.log(tokenImageDiv);
	// console.log(saveButton);
	// console.log(actorEntity);

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
	
	$('label:contains("Token Image Path:")').text("Default Token Image:");
	
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
				<input id="WDIdleTokenPathBox" class="image" type="text" name="imgIdle" placeholder="${idleTokenImage}" value="">
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
				<input id="WDCombatTokenPathBox" class="image" type="text" name="imgCombat" placeholder="${combatTokenImage}" value="">
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
		$('input#WDEnableCheckbox').prop('checked', true);
		tokenImageDiv.hide();
	}

	$('#WDIdleTokenButton').click(async (ev) => {
		await new FilePicker({ type:"image", current:idleTokenImage, callback: (path) => {
			$("#WDIdleTokenPathBox").val(path);
			//$('input[name="img"]').val(path);
			idleTokenImage = path;
		}}).render(true);
	});
	$('#WDCombatTokenButton').click(async (ev) => {
		await new FilePicker({ type:"image", current:combatTokenImage, callback: (path) => {
			$("#WDCombatTokenPathBox").val(path);
			combatTokenImage = path;
		}}).render(true);
	});
	$('input#WDEnableCheckbox').change(function() {
		wdEnabled = $('input#WDEnableCheckbox').is(":checked");
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
				//console.log(combat);
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

		// console.log(inCombatTokens);
		// console.log(idleTokens);
		// console.log(game.scenes);
	});
}