var command_constants = {
   'command': 'command',
   'target': 'target',
   'value':'value',
   'nabcomment':'nabcomment',
   'nabgroup':'nabgroup',
   'nabmetadataname':'nabmetadataname'
};

var xml_tags_constants = {
	'namespace':'http://www.prodyna.com/nabucco_ta/selenium_ide',	
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
								
									//alert("Action: " + JSON.stringify(actions[k]) + "Node name: " + actionAttributes[l].nodeName);								
									
//									if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == 'id'){													
//										if(actionAttributes[l].firstChild){
//											command.id = actionAttributes[l].firstChild.nodeValue;	
//										}else{
//											command.id = "";
//										}
//										command.nabgroup = nabgroup;
//									}else 
										
									if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['command']){										
										if(actionAttributes[l].firstChild){
											command.command = actionAttributes[l].firstChild.nodeValue;
										}else{
											command.command = "";
										}
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['target']){
										if(actionAttributes[l].firstChild){
											command.target = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.target = "";
										}
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['value']){
										if(actionAttributes[l].firstChild){
											command.value = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.value = "";
										}
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['nabmetadataname']){
										if(actionAttributes[l].firstChild){
											command.nabmetadataname = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.nabmetadataname = "";
										}
										command.nabgroup = nabgroup;
									}else if(actionAttributes[l].nodeType == 1 && actionAttributes[l].nodeName == xml_tags_constants['nabcomment']){
										if(actionAttributes[l].firstChild){
											command.nabcomment = actionAttributes[l].firstChild.nodeValue;	
										}else{
											command.nabcomment = "";
										}
										command.nabgroup = nabgroup;
									};
								}
							};
							
							commands.push(command);
							testCase.setCommands(commands);							
							
						}else if(actions[k].nodeType == 1 && actions[k].nodeName == xml_tags_constants['nabgroupname']){ //Teststep name
							nabgroup = actions[k].firstChild.nodeValue;
						};
					};
					
				}else if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == xml_tags_constants['testcasename']){
					//alert("testCaseName: " + testSteps[j].firstChild.nodeValue);
					testCase.name = testSteps[j].firstChild.nodeValue;
				}else if(testSteps[j].nodeType == 1 && testSteps[j].nodeName == xml_tags_constants['baseurl']){
					window.editor.app.setBaseURL(testSteps[j].firstChild.nodeValue);
				}
				
			};			
			
			//alert(JSON.stringify(commands));
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



///**
// * Format an array of commands to the snippet of source.
// * Used to copy the source into the clipboard.
// * 
// * @param name of testCase 
// * @param array of commands.
// * 
// * @return JSON format for importing into NABUCCO TA
// */
//function formatCommands(name, commands, baseURL) {
//  
//  var testSuite = new Object;
//  var testCase = new Object;  
//  testCase.baseURL = baseURL;
//  for (var i = 0; i < commands.length; i++) {
//    var command = commands[i];
//    if (command.type == command_constants['command']) {
//	    if(testCase[command.nabgroup]) {
//	    	var userActions = testCase[command.nabgroup];
//	    	var userAction = createUserAction(command);
//	    	userActions["" + i] = userAction;
//	    } else {
//		  	var actions = new Array();
//		  	var userAction = createUserAction(command);
//		  	actions.push(userAction);
//	    	testCase[command.nabgroup] = actions;
//	    }
//    }else{
//    	this.log.info("Format extension XML NABUCCO TA: formatCommands(name, commands) -> command.type != 'command'");
//    }
//  };
//
//  testSuite[name] = testCase; 
//  
//  return createXMLFromTestSuite(testSuite, "http://www.prodyna.com/nabucco_ta/selenium_ide");
//};

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

//function formatSuite(testSuite, filename) {
	
//	alert("This option is not implemented.");
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
//};