/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
		
	var xmlStringToParse = '';
	var doc = source;
	var parser = new DOMParser();	
	//var parsedDocument; //Parsed document
	
	while (doc.length > 0) {
		
		//The exec() method tests for a match in a string.
		//This method returns the matched text if it finds a match, otherwise it returns null.
	    //In This case the exec method returns an array with two elements. The elements contain the same content
		//(line from file which was read.)
	   var line = /(.*)(\r\n|[\r\n])?/.exec(doc);
	   xmlStringToParse += line[1];
	   
	   //Returns the rest up to line[0].length
	   doc = doc.substr(line[0].length);
	};
	
	//XMLDocument object
	var parsedDocument = parser.parseFromString(xmlStringToParse, "text/xml");
	var node = parsedDocument.activeElement;
	
	
	//node is the Root element
	var allTestCases = node.childNodes;
	
	alert(allTestCases);
	
	for (var i=0; i < allTestCases.length; i++) {
		
		alert("allTestCases: " + allTestCases[i].nodeName);
		
		if(allTestCases[i].nodeType == 1 && allTestCases[i].nodeName == 'testcase'){
			
			var commands = [];
			
			var testSteps = allTestCases[i].childNodes;
			
			for(var j = 0; j < testSteps.length; j++){
				
				if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == 'teststep'){
					
					var testStepName = ''; //The "name" tag must be at the first position in testStep
					var actions = testSteps[j].childNodes;
					
					
					
					for(var k = 0; k < actions.length; k++){
						
						if(actions[k].nodeType == 1 && actions[k].nodeName == 'action'){
							
							var actionAttributes = actions[k].childNodes;
							
							
							var command = new Command();							
							for(var l = 0; l < actionAttributes.length; l++){
								
								if(actionAttributes[l].nodeType == 1){
								
									alert("Action: " + JSON.stringify(actions[k]) + "Node name: " + actionAttributes[l].nodeName);								
									
									if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'id'){													
										if(actionAttributes[l].firstChild){
											command.id = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.id = "";
										}
										command.testStepName = testStepName;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'command'){										
										if(actionAttributes[l].firstChild){
											command.command = actionAttributes[l].firstChild.nodeValue;
										}else{
											command.command = "";
										}
										command.testStepName = testStepName;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'target'){
										if(actionAttributes[l].firstChild){
											command.target = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.target = "";
										}
										command.testStepName = testStepName;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'value'){
										if(actionAttributes[l].firstChild){
											command.value = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.value = "";
										}
										command.testStepName = testStepName;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'metaDataName'){
										if(actionAttributes[l].firstChild){
											command.metaDataName = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.metaDataName = "";
										}
										command.testStepName = testStepName;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'comment'){
										if(actionAttributes[l].firstChild){
											command.comment = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.comment = "";
										}
										command.testStepName = testStepName;
									};
								}
							};
							
							commands.push(command);
							testCase.setCommands(commands);							
							
						}else if(actions[k].nodeType == 1 && actions[k].nodeName == 'name'){ //Teststep name
							testStepName = actions[k].firstChild.nodeValue;
						};
					};
					
				}else if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == 'name'){
					alert("testCaseName: " + testSteps[j].firstChild.nodeValue);
					testCase.name = testSteps[j].firstChild.nodeValue;
				};
				
			};			
			
			alert(JSON.stringify(commands));
		};
		
		
		
	};
	
};
/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name) {
	
	var baseURL = window.editor.app.getBaseURL();
	return (formatCommands(name, testCase.commands, baseURL));
};

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
};

/**
 * Generates (countOfTabs * "\t") (tabs) string object
 * @param countOfTabs
 */
function generateTabs(countOfTabs){	
	var result = '';
	while(countOfTabs > 0){
		result += "\t";	
		countOfTabs--;
	}
	return result;
};

/**
 * @param tagName
 * @param value
 * @param flag
 * 		0 -> open tag \n
 * 		1 -> open tag + value + close tag \n
 * 		2 -> close tag
 * 		3 -> close tag with line break (\n)
 * @param tabsCount before open tag
 * 
 * @returns {String}
 */
function wrapIntoXMLTags(tagName, value, flag, tabsCount, namespace){
	var result = generateTabs(tabsCount);
	switch(flag){
		case 0:
			result += "<" + tagName + ">\n";
			break;
		case 1:
			result += "<" + tagName + ">" + value + "</" + tagName + ">\n";
			break;	
		case 2:
			result += "</" + tagName + ">";
			break;
		case 3:
			result += "</" + tagName + ">\n";
			break;
		case 10:
			result += "<" + tagName + " xmlns = \"" + namespace +"\">\n";
			break;
		default: break;	
	}
	return result;
};

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
}; 

function createXMLFromTestSuite(testSuiteObject, namespace){
	
	var result = '';
	
	result += "<?xml version = \"1.0\" encoding = \"UTF-8\" ?>\n";
	
	//Root element open tag
	result += wrapIntoXMLTags("testconfiguration", null, 10, 0, namespace);
	
	for ( var testCaseName in testSuiteObject) {
		
		//Gets all testCases from testSuite
		if(testSuiteObject.hasOwnProperty(testCaseName)){
			
			//Gets the testCase from testSuite
			var testCaseObject = testSuiteObject[testCaseName];
			
			//Opens testCase tag with 1 tab before open tag
			result += wrapIntoXMLTags("testcase", null, 0, 1, null);
			
			//Creates <name>NAME</name> XML entry with 2 tabs before open tag
			result += wrapIntoXMLTags("name", testCaseName, 1, 2, null);
			
			//Creates <baseURL>BASE_URL</baseURL> XML entry with 2 tabs before open tag
			result += wrapIntoXMLTags("baseURL", testCaseObject.baseURL, 1, 2, null);
			
			for(var testStepName in testCaseObject){
				
				//Gets the testStep from testCase
				if(testCaseObject.hasOwnProperty(testStepName) && testStepName != "baseURL"){
					
					//Opens testStep tag with 2 tab before open tag
					result += wrapIntoXMLTags("teststep", null, 0, 2, null);
					
					//Creates <name>NAME</name> XML entry with 3 tabs before open tag
					result += wrapIntoXMLTags("name", testStepName, 1, 3, null);
					
					//testStepObject is an Array of actions
					var testStepObject = testCaseObject[testStepName];
					for (var i = 0; i < testStepObject.length; i++) {
					    //UserAction in a TestStep
						var action = testStepObject[i];
						
						//Opens "action" tag with 3 tabs before open tag
						result += wrapIntoXMLTags("action", null, 0, 3, null);
						
							//Creates <id>ID</id> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("id", action.id, 1, 4, null);						
							//Creates <command>COMMAND</command> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("command", action.command, 1, 4, null);
							//Creates <target>TARGET</target> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("target", action.target, 1, 4, null);
							//Creates <value>VALUE</value> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("value", action.value, 1, 4, null);
							//Creates <metaDataName>META_DATA_NAME</metaDataName> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("metaDataName", action.metaDataName, 1, 4, null);
							//Creates <comment>COMMENT</comment> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags("comment", action.comment, 1, 4, null);
						
						//Close "action" tag with 3 tab before close tag
						result += wrapIntoXMLTags("action", null, 3, 3, null);
					};
					
					//Close testStep tag with 2 tab before close tag
					result += wrapIntoXMLTags("teststep", null, 3, 2, null);
				}
			};
			
			//Close testCase tag
			result += wrapIntoXMLTags("testcase", null, 3, 1, null);
			
		}
	};
	
	//Root element close tag
	result += wrapIntoXMLTags("testconfiguration", null, 2, 0, null);
	
	return result;
};



/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 * 
 * @param name of testCase 
 * @param array of commands.
 * 
 * @return JSON format for importing into NABUCCO TA
 */
function formatCommands(name, commands, baseURL) {
  
  var testSuite = new Object;
  var testCase = new Object;  
  testCase.baseURL = baseURL;
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
    	this.log.info("Format extension XML NABUCCO TA: formatCommands(name, commands) -> command.type != 'command'");
    }
  };

  testSuite[name] = testCase; 
  
  return createXMLFromTestSuite(testSuite, "http://www.prodyna.com/nabucco_ta/selenium_ide");
};


function formatSuite(testSuite, filename) {
	
	alert("This option is not implemented.");
//	  formattedSuite = 'require "spec/ruby"\n' +
//	      'require "spec/runner"\n' +
//	      '\n' +
//	      "# output T/F as Green/Red\n" +
//	      "ENV['RSPEC_COLOR'] = 'true'\n" +
//	      '\n';
//
//	  for (var i = 0; i < testSuite.tests.length; ++i) {
//	    // have saved or loaded a suite
//	    if (typeof testSuite.tests[i].filename != 'undefined') {
//	      formattedSuite += 'require File.join(File.dirname(__FILE__),  "' + testSuite.tests[i].filename.replace(/\.\w+$/, '') + '")\n';
//	    } else {
//	      // didn't load / save as a suite
//	      var testFile = testSuite.tests[i].getTitle();
//	      formattedSuite += 'require "' + testFile + '"\n';
//	    }
//	  }
//	  return formattedSuite;
};