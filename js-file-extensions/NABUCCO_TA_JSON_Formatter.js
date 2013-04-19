var SEPARATORS = {
  comma: ",",
  tab: "\t"
};

/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {

	
	
	
	var doc = source;
	var commands = [];
    var sep = SEPARATORS[options['separator']];
	while (doc.length > 0) {
		
		//The exec() method tests for a match in a string.
		//This method returns the matched text if it finds a match, otherwise it returns null.
	    //In This case the exec method returns an array with two elements. The elements contain the same content
		//(line from file which was read.)
	   var line = /(.*)(\r\n|[\r\n])?/.exec(doc);
	   var array = line[1].split(sep);
	   
	   //alert("doc " + doc);
	   
	   var obj = JSON.parse(doc);
	   
	    for ( var testCase in obj) {
			if(obj.hasOwnProperty(test)){
				
			}
		}
	   
	   
	   if (array.length >= 3) {
	      var command = new Command();
	      command.command = array[0];
	      command.target = array[1];
	      command.value = array[2];
	      
	      
	      
	      commands.push(command);
	   }
	   
	   //Returns the rest up to line[0].length
	   doc = doc.substr(line[0].length);
	}
	testCase.setCommands(commands);

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

options = {separator: 'comma'};

configForm =
    '<description>Separator</description>' +
	'<menulist id="options_separator">' +
	'<menupopup>' +
	'<menuitem label="Comma" value="comma"/>' +
	'<menuitem label="Tab" value="tab"/>' +
	'</menupopup>' +
	'</menulist>';
