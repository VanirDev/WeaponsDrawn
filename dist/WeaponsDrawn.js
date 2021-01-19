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
	CONFIG.debug.hooks = true; // For debugging only
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

function onRenderTokenConfig (tokenConfig, html) {
	const tokenImageDiv = $("input.image").parent().parent();
	console.log(tokenImageDiv);
	
	let headerHTML = 
		`<div class="form-group">
			<label>Token Icons</label>
		</div>`;

	let defaultIconHTML = 
		`<div class="form-group">
			<label>Out of Combat Token Image:</label>
			<div class="form-fields">
				<button type="button" class="file-picker" data-type="imagevideo" data-target="imgIdle" title="Browse Files" tabindex="-1">
					<i class="fas fa-file-import fa-fw">
					</i>
				</button>
				<input id="WDIdleTokenPathBox" class="image" type="text" name="imgIdle" placeholder="path/image.png" value="">
			</div>
		</div>`;

	let combatIconHTML = 
		`<div class="form-group">
			<label>In Combat Token Image:</label>
			<div class="form-fields">
				<button type="button" class="file-picker" data-type="imagevideo" data-target="imgCombat" title="Browse Files" tabindex="-1">
					<i class="fas fa-file-import fa-fw">
					</i>
				</button>
				<input id="WDCombatTokenPathBox" class="image" type="text" name="imgCombat" placeholder="path/image.png" value="">
			</div>
		</div>`;

	tokenImageDiv.before(headerHTML);
	tokenImageDiv.before(defaultIconHTML);
	tokenImageDiv.before(combatIconHTML);
	tokenImageDiv.hide();

	tokenImageDiv.prev().prev().click(async (ev) => {
		await new FilePicker({ callback: (path) => {
			$("#WDIdleTokenPathBox").val(path);
		}}).render(true);
	});
	tokenImageDiv.prev().click(async (ev) => {
		await new FilePicker({ callback: (path) => {
			$("#WDCombatTokenPathBox").val(path);
		}}).render(true);
	});
}