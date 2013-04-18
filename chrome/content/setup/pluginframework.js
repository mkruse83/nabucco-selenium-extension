// Plugin Framework for Selenium IDE
// Author: Samit Badle
// v0.5

PluginFramework = function(pluginID) {
  this.id = pluginID;
  this.oldApi = false;
  this._uninstall = false;
  this.cleanupHandlers = new Array();
  this.api = new API();
  var self = this;

  //Provide our own method for plugin registration method for IDE if none is provided :-)
  if (!this.api.addPluginProvidedIdeExtension) {
    this.oldApi = true;
    this.api.addPluginProvidedIdeExtension = function(js_url) {
      var options = {};
      var current = this.preferences.getString("ideExtensionsPaths");
      if (!current || current.length == 0) {
        options["ideExtensionsPaths"] = js_url;
        this.preferences.save(options, "ideExtensionsPaths");
      } else {
        if (current.search(js_url) == -1) {
          options["ideExtensionsPaths"] = current + ',' + js_url;
          this.preferences.save(options, "ideExtensionsPaths");
        }
      }
      self.addCleanupHandler(function() {
        this.removePluginProvidedIdeExtension(js_url);
      }, this);
    }
    this.api.removePluginProvidedIdeExtension = function(js_url) {
      // this section removes the extension we added
      var branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.selenium-ide.");
      var plugin_pref = branch.getCharPref("ideExtensionsPaths");
      if (typeof plugin_pref != "undefined") {
        if (plugin_pref.search(js_url) != -1) {
          var split_pref = plugin_pref.split(",");
          for (var pi = 0; pi < split_pref.length; pi++) {
            if (split_pref[pi].search(js_url) != -1) {
              split_pref.splice(pi, 1);
              branch.setCharPref("ideExtensionsPaths", split_pref.join(", "));
              break;
            }
          }
        }
      }
    }
  }

  this.api.addPlugin(pluginID);
  window.addEventListener("load", function() {
    PluginFramework._loaded = true;
    self.register();
  }, false);
};

PluginFramework._loaded = false;

PluginFramework.prototype.observe = function(subject, topic, data) {
  if (topic == "em-action-requested") {
    subject.QueryInterface(Components.interfaces.nsIUpdateItem);
    if (subject.id == this.id) {
      if (data == "item-uninstalled") {
        this._uninstall = true;
      } else if (data == "item-disabled") {
        this._uninstall = true;
      } else if (data == "item-cancel-action") {
        this._uninstall = false;
      }
    }
  } else if (topic == "quit-application-granted") {
    if (this._uninstall) {
      var i;
      for (i = 0; i < this.cleanupHandlers.length; i++) {
        this.cleanupHandlers[i].handler.call(this.cleanupHandlers[i].object, this);
      }
    }
    this.unregister();
  }
};

PluginFramework.prototype.register = function() {
  var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  observerService.addObserver(this, "em-action-requested", false);
  observerService.addObserver(this, "quit-application-granted", false);
};

PluginFramework.prototype.unregister = function() {
  var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  observerService.removeObserver(this, "em-action-requested");
  observerService.removeObserver(this, "quit-application-granted");
};

PluginFramework.prototype.addCleanupHandler = function(cleanupHandler, cleanupObject) {
  this.cleanupHandlers.push({handler: cleanupHandler, object: cleanupObject});
};

PluginFramework.prototype.addPluginProvidedUserExtension = function(js_url, xml_url) {
  this.api.addPluginProvidedUserExtension(js_url, xml_url);
};

PluginFramework.prototype.addPluginProvidedFormatter = function(id, name, url) {
  this.api.addPluginProvidedFormatter(id, name, url);
};

PluginFramework.prototype.addPluginProvidedIdeExtension = function(url) {
  this.api.addPluginProvidedIdeExtension(url);
};

PluginFramework.prototype.addPluginProvidedStringPreference = function(name, defaultValue) {
  this.api.preferences.DEFAULT_OPTIONS[name] = this.api.preferences.getString(name, defaultValue);
  this.api.preferences.save(this.api.preferences.DEFAULT_OPTIONS, name);
  return this.api.preferences.DEFAULT_OPTIONS[name];
};

//private helper function
PluginFramework.prototype._firstRun = function(versionKey, oldVersion, curVersion, URL, waitForLoad) {
  if (oldVersion != curVersion) {
    this.api.preferences.DEFAULT_OPTIONS[versionKey] = curVersion;
    this.api.preferences.save(this.api.preferences.DEFAULT_OPTIONS, versionKey);
    PluginFramework.openTab(URL, waitForLoad);
  }
};

PluginFramework.prototype.firstRun = function(versionKey, URL) {
  try {
    var oldVersion = this.addPluginProvidedStringPreference(versionKey, "");
    //get the version from the addon directly
    try {
      Components.utils.import("resource://gre/modules/AddonManager.jsm");
      var self = this;
      AddonManager.getAddonByID(this.id, function(addon) {
        self._firstRun(versionKey, oldVersion, addon.version, URL, true);
      });
    } catch(ex) {
      var rdf = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService(Components.interfaces.nsIRDFService);
      var dir = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
      dir.append("extensions");
      dir.append(this.id);
      dir.append("install.rdf");
      var ds = rdf.GetDataSourceBlocking("file:///" + dir.path);
      var RDFNode = ds.GetTarget(rdf.GetResource("urn:mozilla:install-manifest"), rdf.GetResource('http://www.mozilla.org/2004/em-rdf#version'), true);
      this._firstRun(versionKey, oldVersion, RDFNode.QueryInterface(Components.interfaces.nsIRDFLiteral).Value, URL, true);
    }
  } catch(e) {
  }
};

PluginFramework.openTab = function(url, waitForLoad) {
  try {
    if (waitForLoad && !this._loaded) {
      setTimeout(function() {
        PluginFramework.openTab(url, waitForLoad);
      }, 1000);
    } else {
      gBrowser.selectedTab = gBrowser.addTab(url);
    }
  } catch(e) {
  }
};
