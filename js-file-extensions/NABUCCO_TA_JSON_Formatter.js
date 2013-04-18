/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
	//TODO: impl.
}

/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name) {
	return (formatCommands(name, testCase.commands));
}

/**
 * Check the content of value.
 * 
 * @return empty string if value is 'undefined' else value
 */
function defaultString(value){
	if (!(value) || value == "undefined") {
		return "";
	} 
	return  value;	
}

/**
 * Creates new object user action, filled with id and values from command object
 */
function createUserAction(id, command) {
	var userAction = new Object;
	userAction.id = id;
	userAction.command = command.command;
	userAction.target = command.target;
	userAction.value = command.value;
	userAction.comment = "" + defaultString(command.comment);
	userAction.metaDataName = "" + defaultString(command.metaDataName);
	
	return userAction;
} 



/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 * 
 * @param name of testCase 
 * @param array of commands.
 * 
 * @return JSON format for importing into NABUCCO TA
 */
function formatCommands(name, commands) {
  
  var testSuite = new Object;
  var testCase = new Object;  
  
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i];
    if (command.type == 'command') {
	    if(testCase[command.testStepName]) {
	    	var userActions = testCase[command.testStepName];
	    	var userAction = createUserAction(i, command);
	    	userActions["" + i] = userAction;
	    } else {
		  	var actions = new Array();
		  	var userAction = createUserAction(i, command);
		  	actions.push(userAction);
	    	testCase[command.testStepName] = actions;
	    }
    }else{
    	this.log.info("Format extension JSON NABUCCO TA: formatCommands(name, commands) -> command.type != 'command'");
    }
  }

  testSuite[name] = testCase;

  return JSON.stringify(testSuite);
}			