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
mytree.setAttribute("disableKeyNavigation", "true");

var mytreecols = document.createElementNS(xulns, "treecols");
var mysplitter1 = document.createElementNS(xulns, "splitter");
mysplitter1.setAttribute("class", "tree-splitter");
var mysplitter2 = document.createElementNS(xulns, "splitter");
mysplitter2.setAttribute("class", "tree-splitter");

var fourthcol = document.createElementNS(xulns, "treecol");
fourthcol.setAttribute("id", "nabcomment");
fourthcol.setAttribute("label", "Nabucco Comment");
fourthcol.setAttribute("width", "120");
fourthcol.setAttribute("flex", "3");
var fifthcol = document.createElementNS(xulns, "treecol");
fifthcol.setAttribute("id", "nabgroup");
fifthcol.setAttribute("label", "Test step");
fifthcol.setAttribute("width", "120");
fifthcol.setAttribute("flex", "3");
var sixthcol = document.createElementNS(xulns, "treecol");
sixthcol.setAttribute("id", "nabmetadataname");
sixthcol.setAttribute("label", "Meta data name");
sixthcol.setAttribute("width", "120");
sixthcol.setAttribute("flex", "3");

mytreecols.appendChild(sixthcol);
mytreecols.appendChild(mysplitter1);
mytreecols.appendChild(fourthcol);
mytreecols.appendChild(mysplitter2);
mytreecols.appendChild(fifthcol);


var mytreechildren = document.createElementNS(xulns, "treechildren");
mytreechildren.setAttribute("id", "nbcTree");
mytree.appendChild(mytreecols);
mytree.appendChild(mytreechildren);

mypanel.appendChild(mytree);
mytabbox.lastChild.appendChild(mypanel);