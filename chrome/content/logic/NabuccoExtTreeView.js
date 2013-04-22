/**
 * This object is the view for the nabucco extension. It is an implementation
 * of the nsITreeView-interface. 
 * See https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsITreeView
 * It also extends the XulUtils.TreeViewHelper-Object defined in xul-utils.js from
 * the selenium-ide source code.
 * Here all GUI operations should be handled like selecting a row etc.pp.
 * NOTE: Use try-catch in every function because errors are not put on screen otherwise.
 */
var NabuccoExtTreeView = classCreate();
objectExtend(NabuccoExtTreeView.prototype, XulUtils.TreeViewHelper.prototype);
objectExtend(
		NabuccoExtTreeView.prototype,
		{
			initialize : function(viewer, tree) {
				try {
					this.log = new Log("NabuccoExtTreeView");
					XulUtils.TreeViewHelper.prototype.initialize.call(this,
							tree);
					this.viewer = viewer;
					this.editor = viewer.editor;
					this.rowCount = 0;
				} catch (error) {
					alert("initialize: " + error);
					this.log.error("Could not initialize treeview " + error);
					throw error;
				}
			},

			/**
			 * Refreshes the tree by calling rowcountchanged. The javascript-interpreter
			 * then calls getCellText etc.pp. from the nsITreeView interface.
			 */
			refresh : function() {
				try {
					var thisstring = "";
					for ( var propertyName in this) {
						thisstring += propertyName + "\n";
					}

					this.log.debug("refresh: old rowCount=" + this.rowCount);
					this.treebox.rowCountChanged(0, -this.rowCount);
					var length = 0;
					if (this.editor.app.testCase != null) {
						length = this.editor.app.testCase.commands.length;
					}
					this.treebox.rowCountChanged(0, length + 1);
					this.rowCount = length + 1;
					if (this.recordIndex > length) {
						this.recordIndex = length;
					}
					this.newCommand = new Command();
					this.log.debug("refresh: new rowCount=" + this.rowCount);
				} catch (error) {
					alert("refresh: " + error);
					this.log.error("Could not refresh treeview " + error);
					throw error;
				}
			},

			getCommand : function(row) {
				try {
					if (row < this.editor.app.testCase.commands.length) {
						var cmd = this.editor.app.testCase.commands[row];
						if (typeof cmd != 'undefined') {
							if (typeof cmd.nabcomment == 'undefined') {
								this.viewer.generateComment(cmd);
							}
							if (typeof cmd.nabgroup == 'undefined') {
								this.viewer.generateGroupIndex(cmd);
							}
						}
						return cmd;
					} else {
						return this.newCommand;
					}
				} catch (error) {
					alert("getCommand: " + error);
					this.log.error("getCommand " + error);
					throw error;
				}
			},

			//
			// nsITreeView interfaces
			//
			// TODO adjust functions to new view. This is mostly just a plain
			// copy from the editor-treeview.
			getCellText : function(row, column) {
				try {
					var colId = column.id != null ? column.id : column;
					var command = this.getCommand(row);
					if (command.type == 'command') {
						return command[colId];
					} else if (command.type == 'comment') {
						return colId == 'command' ? command.comment : '';
					} else {
						return null;
					}
				} catch (error) {
					alert("getCellText: " + error);
					this.log.error("getCellText " + error);
					throw error;
				}
			},
			getRowProperties : function(row, props) {
				try {
					var command = this.getCommand(row);
					if (this.selection.isSelected(row))
						return;
					if (row == this.editor.app.testCase.debugContext.debugIndex) {
						props.AppendElement(this.atomService
								.getAtom("debugIndex"));
					} else if (command.result == 'done') {
						props.AppendElement(this.atomService
								.getAtom("commandDone"));
					} else if (command.result == 'passed') {
						props.AppendElement(this.atomService
								.getAtom("commandPassed"));
					} else if (command.result == 'failed') {
						props.AppendElement(this.atomService
								.getAtom("commandFailed"));
					} else if (command.selectedForReplacement) {
						props.AppendElement(this.atomService
								.getAtom('commandSelectedForReplacement'));
					}
				} catch (error) {
					alert("getRowProperties: " + error);
					this.log.error("getRowProperties " + error);
					throw error;
				}
			},
			getCellProperties : function(row, col, props) {
				try {
					var command = this.getCommand(row);
					if (command.type == 'comment') {
						props
								.AppendElement(this.atomService
										.getAtom("comment"));
					}
					if (command == this.currentCommand) {
						props.AppendElement(this.atomService
								.getAtom("currentCommand"));
					}
					if (row == this.recordIndex) {
						props.AppendElement(this.atomService
								.getAtom("recordIndex"));
					}
					if (0 == col.index && command.breakpoint) {
						props.AppendElement(this.atomService
								.getAtom("breakpoint"));
					}
					if ((this.editor.app.testCase.startPoint) && 0 == col.index
							&& this.editor.app.testCase.startPoint == command) {
						props.AppendElement(this.atomService
								.getAtom("startpoint"));
					}
				} catch (error) {
					alert("getCellProperties: " + error);
					this.log.error("getCellProperties " + error);
					throw error;
				}
			},

			getParentIndex : function(index) {
				try {
					return -1;
				} catch (error) {
					alert("getParentIndex: " + error);
					this.log.error("getParentIndex " + error);
					throw error;
				}
			},

			/**
			 * This function tells the controller which columns should be editable
			 * TODO add group-editing.
			 */
			// isEditable(long row, nsITreeColumn col)
			isEditable : function(row, col) {
				try {
					if (col.id == "nabcomment" || col.id == "nabgroup" || col.id == "nabmetadataname")
						return true;
					return false;
				} catch (error) {
					alert("getParentIndex: " + error);
					this.log.error("getParentIndex " + error);
					throw error;
				}
			},

			/**
			 * This function is used to set the value which the user has entered
			 * previously.
			 * TODO add grouping
			 */
			// setCellText(long row, nsITreeColumn col, AString value)
			setCellText : function(row, col, value) {
				try {
					if (col.id  != "nabcomment" && col.id != "nabgroup" && col.id != "nabmetadataname")
						return;
					var command = this.getCommand(row);
					command[col.id] = "" + value;
				} catch (error) {
					alert("setCellText: " + error);
					this.log.error("setCellText " + error);
					throw error;
				}
			},

			getSourceIndexFromDrag : function() {
			},

			canDrop : function(targetIndex, orientation) {
			}
		});
