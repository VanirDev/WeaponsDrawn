/**
 * Author: Vanir#0001 (Discord) | github.com/VanirDev
 * Software License: Creative Commons Attributions International License
 */

import { registerSettings } from "./module/settings.js";
import { preloadTemplates } from "./module/preloadTemplates.js";

const defaultIcon = "icons/svg/mystery-man.svg";

Hooks.once("init", async function () {
  console.log("Weapons Drawn | Initializing WeaponsDrawn");
  registerSettings();
  //CONFIG.debug.hooks = true; // For debugging only
  await preloadTemplates();
});

Hooks.on("renderTokenConfig", onRenderTokenConfig);
window.Hooks.on("deleteCombat", function (combat, arg2, arg3) {
  if (combat.data) {
    const combatantsList = combat.data.combatants.contents;
    for (let i = 0; i < combatantsList.length; i++) {
      toggleImage(false, combatantsList[i].token);
    }
  }
});

window.Hooks.on("deleteCombatant", function (combat, arg2, arg3) {
  if (combat.data) {
    toggleImage(false, combat.token);
  }
});
window.Hooks.on("createCombatant", function (combat, combatant, userId) {
  if (combat.data) {
    toggleImage(true, combat.token);
  }
});

// TODO: Will not work yet
/*
window.Hooks.on("createToken", function (arg1, arg2, arg3) {
  if (arg1.data) {
    let combatantsList = {
      actorId: arg1.data.actorId,
      tokenId: arg1.data._id,
    };
    toggleImage(false, [combatantsList], arg1.parent.data._id);
  }
});
*/

function toggleImage(isCombat, token) {
  if (!game.user.isGM) {
    return;
  }

  const tokenImgPath = getStateTokenImgPath(token, isCombat);
  updateTokenImg(token, tokenImgPath);
}

function getStateTokenImgPath(tokenEntity, inCombat) {
  let idleTokenImage = "";
  let combatTokenImage = "";

  if (tokenEntity.data.flags.hasOwnProperty("WeaponsDrawn")) {
    idleTokenImage = tokenEntity.getFlag("WeaponsDrawn", "idle");
    combatTokenImage = tokenEntity.getFlag("WeaponsDrawn", "combat");
  }
  if (idleTokenImage == "" || idleTokenImage == undefined) {
    idleTokenImage = tokenEntity.data.img;
    if (combatTokenImage == "" || combatTokenImage == undefined) {
      combatTokenImage = idleTokenImage;
    }
  }

  return inCombat ? combatTokenImage : idleTokenImage;
}

function updateTokenImg(token, tokenImgPath) {
  if (token.getFlag("WeaponsDrawn", "enabled")) {
    token.update({ img: tokenImgPath });
  }
}

function onRenderTokenConfig(tokenConfig, html) {
  const tokenImageDiv = html.find($("input.image")).parent().parent();
  const saveButton = html.find($('button[name="submit"]'));
  let tokenEntity = tokenConfig.token;

  let idleTokenImage = "";
  let combatTokenImage = "";
  let wdEnabled = false;

  if (tokenEntity.data.flags.hasOwnProperty("WeaponsDrawn")) {
    idleTokenImage = tokenEntity.getFlag("WeaponsDrawn", "idle");
    combatTokenImage = tokenEntity.getFlag("WeaponsDrawn", "combat");
    wdEnabled = tokenEntity.getFlag("WeaponsDrawn", "enabled");
  }
  if (idleTokenImage == "" || idleTokenImage == undefined) {
    idleTokenImage = tokenEntity.data.img;
    if (combatTokenImage == "" || combatTokenImage == undefined) {
      combatTokenImage = idleTokenImage;
    }
  }

  idleTokenImage =
    idleTokenImage == "" || idleTokenImage == undefined
      ? defaultIcon
      : idleTokenImage;
  combatTokenImage =
    combatTokenImage == "" || combatTokenImage == undefined
      ? defaultIcon
      : combatTokenImage;

  html
    .find($('label:contains("Token Image Path:")'))
    .text("Default Token Image:");

  const headerHTML = `<div class="form-group">
			  <label>Enable Weapons Drawn Tokens:</label>
			  <input id="WDEnableCheckbox" type="checkbox" name="enableWeaponsDrawn" data-dtype="Boolean">
		  </div>`;

  const defaultIconHTML = `<div class="form-group">
			  <label>Out of Combat Token Image:</label>
			  <div class="form-fields">
				  <button id="WDIdleTokenButton" type="button" class="file-picker" data-type="imagevideo" data-target="imgIdle" title="Browse Files" tabindex="-1">
					  <i class="fas fa-file-import fa-fw">
					  </i>
				  </button>
				  <input id="WDIdleTokenPathBox" class="image" type="text" name="imgIdle" placeholder="path/image.png" value="${idleTokenImage}" value="">
			  </div>
		  </div>`;

  const combatIconHTML = `<div class="form-group">
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
    tokenImageDiv.show();
  } else {
    html.find($("input#WDEnableCheckbox")).prop("checked", true);
    tokenImageDiv.hide();
  }

  html.find($("#WDIdleTokenButton")).click(async (ev) => {
    await new FilePicker({
      type: "imagevideo",
      current: idleTokenImage,
      callback: (path) => {
        html.find($("#WDIdleTokenPathBox")).val(path);
        idleTokenImage = path;
      },
    }).render(true);
  });
  html.find($("#WDCombatTokenButton")).click(async (ev) => {
    await new FilePicker({
      type: "imagevideo",
      current: combatTokenImage,
      callback: (path) => {
        html.find($("#WDCombatTokenPathBox")).val(path);
        combatTokenImage = path;
      },
    }).render(true);
  });
  html.find($("input#WDEnableCheckbox")).change(function () {
    wdEnabled = html.find($("input#WDEnableCheckbox")).is(":checked");
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
  saveButton.bind("click", async function () {
    await tokenEntity.setFlag("WeaponsDrawn", "idle", idleTokenImage);
    await tokenEntity.setFlag("WeaponsDrawn", "combat", combatTokenImage);
    await tokenEntity.setFlag("WeaponsDrawn", "enabled", wdEnabled);

    if (!wdEnabled) {
      return;
    }

    let inCombatTokens = [];
    let idleTokens = [];

    game.scenes.forEach((scene, sceneKey) => {
      scene.data.tokens.forEach((token) => {
        if (
          token.actorId == tokenEntity.data.id &&
          !inCombatTokens.includes(token.id)
        ) {
          updateTokenImg(tokenEntity, idleTokenImage);
          idleTokens.push(tokenEntity.id);
        }
      });
    });
  });
}
