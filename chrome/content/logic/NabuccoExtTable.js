/**
 * This script is inserted at the nabucco extension overlay. It defines
 * a new tab in the selenium main view. This tab displays a new table with
 * comment and grouping.
 */

var xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
var mytabbox = document.getElementById("tabbox");
var mytab = document.createElementNS(xulns, "tab");
mytab.setAttribute("id", "nabuccoTab");
mytab.setAttribute("label", "Nabucco");
mytabbox.firstChild.appendChild(mytab);
var mypanel = document.createElementNS(xulns, "tabpanel");

var mytree = document.createElementNS(xulns, "tree");
mytree.setAttribute("id", "nbcCommands");
mytree.setAttribute("flex", "1");
mytree.setAttribute("enableColumnDrag", "false");
mytree.setAttribute("hidecolumnpicker", "true");
// make editable so that comment and group can be
// changed by the user.
mytree.setAttribute("editable", "true"); 
//mytree.setAttribute("context", "treeContextMenu");
//mytree.setAttribute("onselect", "window.editor.treeView.selectCommand()");
//mytree.setAttribute("ondblclick", "goDoCommand('cmd_selenium_exec_command')");
mytree.setAttribute("disableKeyNavigation", "true");

var mytreecols = document.createElementNS(xulns, "treecols");
var mysplitter = document.createElementNS(xulns, "splitter");
mysplitter.setAttribute("class", "tree-splitter");
var firstcol = document.createElementNS(xulns, "treecol");
firstcol.setAttribute("id", "command");
// &command.label; does not work when script is "outsourced"
//firstcol.setAttribute("label", "&command.label;");
firstcol.setAttribute("label", "Command");
firstcol.setAttribute("width", "120");
var secondcol = document.createElementNS(xulns, "treecol");
secondcol.setAttribute("id", "target");
//secondcol.setAttribute("label", "&target.label;");
secondcol.setAttribute("label", "Target");
secondcol.setAttribute("width", "120");
secondcol.setAttribute("flex", "3");
var thirdcol = document.createElementNS(xulns, "treecol");
thirdcol.setAttribute("id", "value");
//thirdcol.setAttribute("label", "&value.label;");
thirdcol.setAttribute("label", "Value");
thirdcol.setAttribute("width", "120");
thirdcol.setAttribute("flex", "3");
var fourthcol = document.createElementNS(xulns, "treecol");
fourthcol.setAttribute("id", "nabcomment");
fourthcol.setAttribute("label", "Nabucco Comment");
fourthcol.setAttribute("width", "120");
fourthcol.setAttribute("flex", "3");
var fifthcol = document.createElementNS(xulns, "treecol");
fifthcol.setAttribute("id", "nabgroup");
fifthcol.setAttribute("label", "Group");
fifthcol.setAttribute("width", "120");
fifthcol.setAttribute("flex", "3");

mytreecols.appendChild(firstcol);
mytreecols.appendChild(mysplitter);
mytreecols.appendChild(secondcol);
mytreecols.appendChild(mysplitter);
mytreecols.appendChild(thirdcol);
mytreecols.appendChild(fourthcol);
mytreecols.appendChild(fifthcol);

var mytreechildren = document.createElementNS(xulns, "treechildren");
mytreechildren.setAttribute("id", "nbcTree");
// mytreechildren.setAttribute("ondraggesture", "nsDragAndDrop.startDrag(event,
// commandsDragObserver);");
//mytreechildren
//		.setAttribute("onclick", "window.editor.nabuccoExtView.myAlert()");

mytree.appendChild(mytreecols);
mytree.appendChild(mytreechildren);

mypanel.appendChild(mytree);
mytabbox.lastChild.appendChild(mypanel);