/**
 * This script is inserted at the nabucco extension overlay for the selenium
 * ide common overlay. It modifies the context-menu definitions to add a new
 * context menu for nabucco. For that you have to add a new command, key and
 * the context menu itself.
 */

var xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

var nbcCommand = document.createElementNS(xulns, "command");
nbcCommand.setAttribute("id", "cmd_nabucco_group_first");
nbcCommand.setAttribute("oncommand", "goDoCommand('cmd_nabucco_group_first')");

var seleniumCommands = document.getElementById("seleniumIDECommands");
seleniumCommands.appendChild(nbcCommand);

var nbcKey = document.createElementNS(xulns, "key");
nbcKey.setAttribute("id", "nbc_group_first_key");
nbcKey.setAttribute("key", "G");
nbcKey.setAttribute("command", "cmd_nabucco_group_first");

var seleniumKeys = document.getElementById("seleniumIDEKeys");
seleniumKeys.appendChild(nbcKey);


var menupopup = document.createElementNS(xulns, "menupopup");
menupopup.setAttribute("id", "nbcContextMenu");

var menuItem = document.createElementNS(xulns, "menuitem");
menuItem.setAttribute("id", "nbcGroupFirst");
menuItem.setAttribute("label", "Group by first");
menuItem.setAttribute("command", "cmd_nabucco_group_first");
menuItem.setAttribute("key", "nbc_group_first_key");
menuItem.setAttribute("accesskey", "G");

menupopup.appendChild(menuItem);

var seleniumpopups = document.getElementById("seleniumIDEPopup");
seleniumpopups.appendChild(menupopup);


