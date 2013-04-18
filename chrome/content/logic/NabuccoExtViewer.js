/*
 * Copyright 2010, 2012 Samit Badle, Samit.Badle@gmail.com
 * http://blog.reallysimplethoughts.com/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This code serves as base for our plugin. It originated from the
// StoredVars-Plugin 'http://blog.reallysimplethoughts.com/'

StoredVarsView = (function() {
//	SBDialogs = {};
//	SBDialogs.confirm = function(message, title) {
//		return Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
//				.getService(Components.interfaces.nsIPromptService).confirm(
//						null, title, message);
//	};
//
	function StoredVarsView(editor) {
		this.editor = editor;
//		this.showDefaults = false;
//		this.view = document.getElementById("storedVarsView");
//		this.varsElement = this.view.contentDocument.getElementById("vars");
//		this.msgElement = this.view.contentDocument.getElementById("msg");
//		this.splashElement = this.view.contentDocument.getElementById("splash");
//		this.view.contentDocument.getElementById("bloglink").addEventListener(
//				"click", function() {
//					openTabOrWindow('http://blog.reallysimplethoughts.com/');
//				}, false);
	}
//
//	var NO_STORED_VARS_MSG = "Stored variables will be available once you play a test case or execute a command. Click the Refresh button to refresh.";
//	var ONLY_DEFAULT_STORED_VARS_MSG = "No stored variables have been created by the test case. If you want to view the default stored variables (nbsp and space), click the 'Show default variables' from the Stored variables menu. Click the Refresh button to refresh.";
//	var OLD_STORED_VARS_MSG = "Selenium IDE keeps the old stored variables and they will also be shown. Click the Refresh button to refresh.";
//
//	StoredVarsView.prototype.show = function() {
//		this.view.hidden = false;
//		document.getElementById("storedVarsButtons").hidden = false;
//		document.getElementById("storedVarsTab").setAttribute("selected",
//				"true");
//		this.update();
//		document.getElementById("fbarStoredVars").open(0);
//	};
//
//	StoredVarsView.prototype.hide = function() {
//		document.getElementById("fbarStoredVars").close();
//		document.getElementById("storedVarsTab").removeAttribute("selected");
//		this.view.hidden = true;
//		document.getElementById("storedVarsButtons").hidden = true;
//	};
//
//	StoredVarsView.prototype.toggleDefaultVars = function(evt, toolButton) {
//		if (evt.target.id && evt.target.id == "storedVarsShowDefaultVars") {
//			this.showDefaults = !this.showDefaults;
//			toolButton.checked = this.showDefaults;
//			this.update();
//		}
//	};
//
//	StoredVarsView.prototype.update = function() {
//		var showDefaults = this.showDefaults;
//		var numVars = 0;
//		this.clear();
//		if (this.editor.selDebugger) {
//			if (this.editor.selDebugger.runner) {
//				if (this.editor.selDebugger.runner.storedVars) {
//					for ( var key in this.editor.selDebugger.runner.storedVars) {
//						if (showDefaults || (key != "nbsp" && key != "space")) {
//							this
//									.insertItem(
//											key,
//											this.editor.selDebugger.runner.storedVars[key],
//											numVars % 2,
//											(key != "nbsp" && key != "space"));
//							numVars++;
//						}
//					}
//					if (numVars == 0) {
//						this.showMessage(ONLY_DEFAULT_STORED_VARS_MSG);
//					} else if (!(showDefaults && numVars == 2)) {
//						this.showMessage(OLD_STORED_VARS_MSG);
//					}
//					this.splashElement.className = 'no-msg';
//				} else {
//					this.showMessage(NO_STORED_VARS_MSG);
//				}
//			} else {
//				this.showMessage(NO_STORED_VARS_MSG);
//			}
//		} else {
//			this.showMessage(NO_STORED_VARS_MSG);
//		}
//		return true;
//	};
//
//	StoredVarsView.prototype.insertItem = function(itemName, itemValue,
//			applyOddClass, isUserVar) {
//		var li = this.view.contentDocument.createElement('li');
//		if (applyOddClass) {
//			li.className = "odd";
//		}
//		if (isUserVar) {
//			var checkBox = this.view.contentDocument.createElement('input');
//			checkBox.type = "checkbox";
//			checkBox.name = "vars-check";
//			checkBox.value = itemName;
//			li.appendChild(checkBox);
//		}
//		li.appendChild(this.view.contentDocument.createTextNode(" " + itemName
//				+ (itemValue ? ' = "' + itemValue + '"' : '')));
//		this.varsElement.appendChild(li);
//	};
//
//	StoredVarsView.prototype.removeAllVars = function() {
//		if (this.editor.selDebugger) {
//			if (this.editor.selDebugger.runner) {
//				if (this.editor.selDebugger.runner.storedVars) {
//					if (SBDialogs.confirm("Remove all stored variables?",
//							"Stored Variables")) {
//						for ( var key in this.editor.selDebugger.runner.storedVars) {
//							if (key != "nbsp" && key != "space") {
//								// TODO: add support for undo
//								delete this.editor.selDebugger.runner.storedVars[key];
//							}
//						}
//						this.update();
//					}
//				}
//			}
//		}
//	};
//
//	StoredVarsView.prototype.removeSelectedVars = function() {
//		var checkBoxes = this.view.contentDocument
//				.getElementsByName('vars-check');
//		for ( var i = 0; i < checkBoxes.length; i++) {
//			var c = checkBoxes[i];
//			if (c.checked) {
//				// TODO: add support for undo
//				// No need to check for default vars as they don't get check
//				// boxes
//				delete this.editor.selDebugger.runner.storedVars[c.value];
//			}
//		}
//		this.update();
//	};
//
//	StoredVarsView.prototype.showMessage = function(message) {
//		this.msgElement.innerHTML = message;
//		this.msgElement.className = 'msg';
//	};
//
//	StoredVarsView.prototype.clear = function() {
//		this.varsElement.innerHTML = '';
//		this.msgElement.innerHTML = '';
//		this.msgElement.className = 'no-msg';
//	};
//
	StoredVarsView.prototype.myAlert = function() {
		alert("test");
	};

	return StoredVarsView;
})();

// Init the extension
try {
	this.editor.storedVarsView = new StoredVarsView(this.editor);
} catch (error) {
	alert('Error in StoredVarsViewer: ' + error);
}