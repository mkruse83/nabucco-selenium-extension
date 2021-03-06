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

/**
 * This is the class where all logic of the nabucco-extension should
 * be handled. It has access to the tree-view and the selenium editor.
 */
NabuccoExtView = (function() {

	function NabuccoExtView(editor) {
		try {
			this.editor = editor;
			this.tree = document.getElementById("nbcCommands");
			this.view = new NabuccoExtTreeView(this, this.tree);
			var self = this; // needed to have access to "this" within the Object
								// that is added in "addObserver" below
	
			// adding an observer to the editor. the object implements some methods
			// that are called from the editor when e.g. the testcase has changed.
			// enable alerts to learn when these events are fired.
			editor.app.addObserver({
				baseURLChanged : function() {
					// alert("baseURL");
				},
	
				optionsChanged : function() {
					// alert("optionsChanged");
	
				},
	
				testSuiteChanged : function(testSuite) {
					// alert("testSuiteChanged");
					testSuite.addObserver(this._testSuiteObserver);
				},
	
				testSuiteUnloaded : function(testSuite) {
					// alert("testSuiteUnloaded");
					testSuite.removeObserver(this._testSuiteObserver);
				},
	
				testCaseChanged : function(testCase) {
					// alert("testCaseChanged");
					self.updateView();
					testCase.addObserver(this._testCaseObserver);
				},
	
				testCaseUnloaded : function(testCase) {
					// alert("testCaseUnloaded");
					testCase.removeObserver(this._testCaseObserver);
				},
	
				/**
				 * called when the format is changing. It synchronizes the testcase
				 * before changing the view with a converted testcase in the new
				 * format
				 */
				currentFormatChanging : function() {
					// alert("currentFormatChanging");
				},
	
				currentFormatChanged : function(format) {
					// alert("currentFormatChanged");
				},
	
				/**
				 * called when the format can't be changed. It advises the user of
				 * the undoable action
				 */
				currentFormatUnChanged : function(format) {
					// alert("currentFormatUnChanged");
				},
	
				clipboardFormatChanged : function(format) {
				},
	
				// an observer that is added by the editor itself. 
				_testCaseObserver : {
					modifiedStateUpdated : function() {
						// alert("_testCaseObserver");
						self.updateView();
					}
				},
	
				_testSuiteObserver : {
					testCaseAdded : function() {
						// alert("_testSuiteObserver");
						self.updateView();
					}
					
				
				}
			});
		} catch (error) {
			alert('Error initializing viewer: ' + error);
		}
	}

	/**
	 * This function should generate a comment that the user
	 * can adjust later. It should translate the commands
	 * and add speaking names for the control.
	 */
	NabuccoExtView.prototype.generateComment = function(cmd) {
		try {
//			var commandMap = {      
//				//key = selenium-command
//	            //matcher: $site, $value, $field
//	            "open" : "Es wurde die Seite #target ge�ffnet",
//	            "type" : "Der Wert #value wurde in das Feld #target eingetippt",
//	            "typeKeys" : "Der Wert #value wurde in das Feld #target eingetippt",
//	            "click" : "Es wurde das Feld #target angeklickt",
//	            "clickAndWait" : "Es wurde das Feld #target angeklickt",
//	            "select" : "Es wurde der Wert #value aus der Selectbox #target ausgew�hlt",
//	        };
			
			var commandMap = {      
					//key = selenium-command
					//matcher: $site, $value, $field
					"open" : "The site #target was opened",
					"type" : "The value #value was entered into #target field",
					"typeKeys" : "The value #value was entered into #target field",
					"click" : "The field #target was clicked",
					"clickAndWait" : "The field #target was clicked",
					"select" : "The value #value from #target was selected"
			};
			
			var command = "";
			if (cmd.command in commandMap) {
				command = commandMap[cmd.command];
			}
			cmd.nabcomment = command.replace(/#value/, "\"" + cmd.value + "\"").replace(/#target/, "\"" + cmd.target + "\"");
		} catch (error) {
			this.log.error("generateComment: " + error);
			throw error;
		}
	};

	/**
	 * This function should generate a grouping index used on
	 * import. The group index is empty per default.
	 */
	NabuccoExtView.prototype.generateGroupIndex = function(cmd) {
		cmd.nabgroup = "";
		// TODO implementation
		// TODO try catch
	};

	/**
	 * This function updates the tree view. It should be called
	 * whenever the original tree from selenium is changed.
	 */
	NabuccoExtView.prototype.updateView = function() {
		try {
			this.view.refresh();
		} catch (error) {
			alert('Error while refreshing tree: ' + error);
		}
	};
	
	/**
	 * This function enters the group from the first selected line and
	 * copies it to all selected lines. This is part of the context menu.
	 */
	NabuccoExtView.prototype.groupByFirst = function() {
		try {
			if (this.view.selection.getRangeCount() > 0) {
				var start = new Object();
				var end = new Object();
				this.view.selection.getRangeAt(0, start, end);
				var group = this.view.getCommand(start.value).nabgroup;
				for (var rangeIndex = 0; rangeIndex < this.view.selection.getRangeCount(); rangeIndex++) {
					this.view.selection.getRangeAt(rangeIndex, start, end);
					for (var index = start.value; index <= end.value; index++) {
						this.view.getCommand(index).nabgroup = group;
					}
				}
			}
			
		} catch (error) {
			alert("Could not groupByFirst " + error);
			this.log.error("Could not groupByFirst " + error);
			throw error;
		}
	};

	return NabuccoExtView;
})();

// Init the extension
try {
	this.editor.nabuccoExtView = new NabuccoExtView(this.editor);
} catch (error) {
	alert('Error while initializing NabuccoExtViewer: ' + error);
}