
/**
 * Collection with constants for using in functions. 
 * It's the central position for changing attribute names.
 */
var command_constants = {
   'command': 'command',
   'target': 'target',
   'value':'value',
   'nabcomment':'nabcomment',
   'nabgroup':'nabgroup',
   'nabmetadataname':'nabmetadataname'
};

/**
 * Collection with constants for using in functions to import and export in XML.
 * Each constant describes a tag in XML document.
 * It's the central position for changing attribute names.
 */
var xml_tags_constants = {
	'namespace':'http://www.prodyna.com',	
	'testconfiguration':'testconfiguration',
	'testcasename':'name',
	'testcase':'testcase',
	'baseurl':'baseurl',
	'action':'action', 
	'command': 'command',
	'target': 'target',
	'value':'value',
	'nabcomment':'nabcomment',
	'nabgroup':'nabgroup',
	'nabgroupname':'name',
	'nabmetadataname':'nabmetadataname'		
};

/**
 * Checks if a XMLNode has one or more children returns the value of first child, else 'undefined'.
 * @param node
 * @returns string object
 */
function checkEmptyEntry(node){
	var result;
	
	if(node.firstChild){
		result = node.firstChild.nodeValue;
	}else{
		result = '';
	}
	
	return result;
}

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
	
	//alert(allTestCases);
	
	for (var i=0; i < allTestCases.length; i++) {
		
		//alert("allTestCases: " + allTestCases[i].nodeName);
		
		if(allTestCases[i].nodeType == 1 && allTestCases[i].nodeName == xml_tags_constants['testcase']){
			
			var commands = [];
			
			var testSteps = allTestCases[i].childNodes;
			
			for(var j = 0; j < testSteps.length; j++){
				
				if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == xml_tags_constants['nabgroup']){
					
					var nabgroup = ''; //The "name" tag must be at the first position in testStep
					var actions = testSteps[j].childNodes;
					for(var k = 0; k < actions.length; k++){
						
						if(actions[k].nodeType == 1 && actions[k].nodeName == xml_tags_constants['action']){
							
							var actionAttributes = actions[k].childNodes;
							
							
							var command = new Command();							
							for(var l = 0; l < actionAttributes.length; l++){
								
								if(actionAttributes[l].nodeType == 1){								
																			
									if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['command']){										
										command.command = checkEmptyEntry(actionAttributes[l]);
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['target']){
										command.target = checkEmptyEntry(actionAttributes[l]);
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['value']){
										command.value = checkEmptyEntry(actionAttributes[l]);	
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['nabmetadataname']){
										command.nabmetadataname = checkEmptyEntry(actionAttributes[l]);
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['nabcomment']){
										command.nabcomment = checkEmptyEntry(actionAttributes[l]);
										command.nabgroup = nabgroup;
									};
								}
							};
							
							commands.push(command);
							testCase.setCommands(commands);							
							
						}else if(actions[k].nodeType == 1 && actions[k].nodeName == xml_tags_constants['nabgroupname']){ //Teststep name
								nabgroup = checkEmptyEntry(actions[k]);
						};
					};
					
				}else if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == xml_tags_constants['testcasename']){
						testCase.name = checkEmptyEntry(testSteps[j]);
						
				}else if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == xml_tags_constants['baseurl']){
					if(testSteps[j].firstChild){
						window.editor.app.setBaseURL(testSteps[j].firstChild.nodeValue);
					}else{
						//Nothing: Selenium IDE has an default value of basic URL
					}
				}
				
			};			
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
function wrapIntoXMLTags(tagName, value, flag, namespace){
	var result = '';
	switch(flag){
		case 0:
			result += "<" + tagName + ">";
			break;
		case 1:
			result += "<" + tagName + ">" + value + "</" + tagName + ">";
			break;	
		case 2:
			result += "</" + tagName + ">";
			break;		
		case 10:
			result += "<" + tagName + " xmlns = \"" + namespace +"\">";
			break;
		default: break;	
	}
	return result;
};

/**
 * Creates new object user action, filled with id and values from command object
 */
function createUserAction(command) {
	var userAction = new Object;
	//userAction.id = id;
	userAction[command_constants['command']] = command[command_constants['command']];
	userAction[command_constants['target']] = command[command_constants['target']];
	userAction[command_constants['value']] = command[command_constants['value']];
	userAction[command_constants['nabcomment']] = "" + defaultString(command[command_constants['nabcomment']]);
	userAction[command_constants['nabmetadataname']] = "" + defaultString(command[command_constants['nabmetadataname']]);
	
	return userAction;
}; 

function createXMLFromTestSuite(testSuiteObject, namespace){
	
	var result = '';
	
	result += "<?xml version = \"1.0\" encoding = \"UTF-8\" ?>";
	
	//Root element open tag
	result += wrapIntoXMLTags(xml_tags_constants['testconfiguration'], null, 10, namespace);
	
	for ( var testCaseName in testSuiteObject) {
		
		//Gets all testCases from testSuite
		if(testSuiteObject.hasOwnProperty(testCaseName)){
			
			//Gets the testCase from testSuite
			var testCaseObject = testSuiteObject[testCaseName];
			
			//Opens testCase tag with 1 tab before open tag
			result += wrapIntoXMLTags(xml_tags_constants['testcase'], null, 0, null);
			
			//Creates <name>NAME</name> XML entry with 2 tabs before open tag
			result += wrapIntoXMLTags(xml_tags_constants['testcasename'], testCaseName, 1, null);
			
			//Creates <baseURL>BASE_URL</baseURL> XML entry with 2 tabs before open tag
			result += wrapIntoXMLTags(xml_tags_constants['baseurl'], testCaseObject[xml_tags_constants['baseurl']], 1, null);
			
			for(var nabgroup in testCaseObject){
				
				//Gets the testStep from testCase
				if(testCaseObject.hasOwnProperty(nabgroup) && nabgroup != xml_tags_constants['baseurl']){
					
					//Opens testStep tag with 2 tab before open tag
					result += wrapIntoXMLTags(xml_tags_constants['nabgroup'], null, 0, null);
					
					//Creates <name>NAME</name> XML entry with 3 tabs before open tag
					result += wrapIntoXMLTags(xml_tags_constants['nabgroupname'], nabgroup, 1, null);
					
					//testStepObject is an Array of actions
					var testStepObject = testCaseObject[nabgroup];
					for (var i = 0; i < testStepObject.length; i++) {
					    //UserAction in a TestStep
						var action = testStepObject[i];
						
						//Opens "action" tag with 3 tabs before open tag
						result += wrapIntoXMLTags(xml_tags_constants['action'], null, 0, null);
						
							//Creates <id>ID</id> XML entry with 4 tabs before open tag
							//result += wrapIntoXMLTags("id", action.id, 1, null);						
							//Creates <command>COMMAND</command> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags(xml_tags_constants['command'], action.command, 1, null);
							//Creates <target>TARGET</target> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags(xml_tags_constants['target'], action.target, 1, null);
							//Creates <value>VALUE</value> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags(xml_tags_constants['value'], action.value, 1, null);
							//Creates <nabmetadataname>META_DATA_NAME</nabmetadataname> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags(xml_tags_constants['nabmetadataname'], action.nabmetadataname, 1, null);
							//Creates <nabcomment>nabcomment</nabcomment> XML entry with 4 tabs before open tag
							result += wrapIntoXMLTags(xml_tags_constants['nabcomment'], action.nabcomment, 1, null);
						
						//Close "action" tag with 3 tab before close tag
						result += wrapIntoXMLTags(xml_tags_constants['action'], null, 2, null);
					};
					
					//Close testStep tag with 2 tab before close tag
					result += wrapIntoXMLTags(xml_tags_constants['nabgroup'], null, 2, null);
				}
			};
			
			//Close testCase tag
			result += wrapIntoXMLTags(xml_tags_constants['testcase'], null, 2, null);
			
		}
	};
	
	//Root element close tag
	result += wrapIntoXMLTags(xml_tags_constants['testconfiguration'], null, 2, null);
	
	return result;
};

/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 * 
 * @param name of testCase 
 * @param array of commands.
 * 
 * @return XML format for importing into NABUCCO TA
 */
function formatCommands(name, commands, baseURL) {
  
  var testSuite = new Object;
  var testCase = new Object;  
  testCase[xml_tags_constants['baseurl']] = baseURL;
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i];
    if (command.type == command_constants['command']) {
	    if(testCase[command[command_constants['nabgroup']]]) {
	    	var userActions = testCase[command[command_constants['nabgroup']]];
	    	var userAction = createUserAction(command);
	    	userActions["" + i] = userAction;
	    } else {
		  	var actions = new Array();
		  	var userAction = createUserAction(command);
		  	actions.push(userAction);
	    	testCase[command[command_constants['nabgroup']]] = actions;
	    }
    }else{
    	this.log.info("Format extension XML NABUCCO TA: formatCommands(name, commands) -> command.type != 'command'");
    }
  };

  testSuite[name] = testCase; 
  
  return createXMLFromTestSuite(testSuite, xml_tags_constants['namespace']);
};