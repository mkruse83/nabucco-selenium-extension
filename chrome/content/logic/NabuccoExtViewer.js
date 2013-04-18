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
NabuccoExtView = (function() {

	function NabuccoExtView(editor) {
		this.editor = editor;
		editor.app.addObserver({
			baseURLChanged : function() {
				alert("baseURL");
			},

			optionsChanged : function() {
				alert("optionsChanged");

			},

			testSuiteChanged : function(testSuite) {
				alert("testSuiteChanged");
			},

			testSuiteUnloaded : function(testSuite) {
				alert("testSuiteUnloaded");
			},

			testCaseChanged : function(testCase) {
				alert("testCaseChanged");
			},

			testCaseUnloaded : function(testCase) {
				alert("testCaseUnloaded");
			},

			/**
			 * called when the format is changing. It synchronizes the testcase
			 * before changing the view with a converted testcase in the new
			 * format
			 */
			currentFormatChanging : function() {
				alert("currentFormatChanging");
			},

			currentFormatChanged : function(format) {
				alert("currentFormatChanged");
			},

			/**
			 * called when the format can't be changed. It advises the user of
			 * the undoable action
			 */
			currentFormatUnChanged : function(format) {
				alert("currentFormatUnChanged");
			},

			clipboardFormatChanged : function(format) {
			},

			_testCaseObserver : {
				modifiedStateUpdated : function() {
					alert("_testCaseObserver");
				}
			},

			_testSuiteObserver : {
				testCaseAdded : function() {
					alert("_testSuiteObserver");
				}
			}
		});
	}

	NabuccoExtView.prototype.myAlert = function() {
		alert("test");

		var message = "";
		for ( var i = 0; i < editor.app.testCase.commands.length; i++) {
			var cmd = editor.app.testCase.commands[i];
			message = message + "cmd: " + cmd.command + " target: "
					+ cmd.target + " value: " + cmd.value + "\n";
		}
		alert(message);

	};

	return NabuccoExtView;
})();

// Init the extension
try {
	this.editor.nabuccoExtView = new NabuccoExtView(this.editor);
} catch (error) {
	alert('Error while initializing NabuccoExtViewer: ' + error);
}