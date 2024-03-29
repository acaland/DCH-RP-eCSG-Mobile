var net = require('net');

Ti.API.info("lastLogin: " + net.lastLogin);
Ti.API.info("shibCookie:" + net.shibCookie);
Ti.API.info("username:" + net.username);

// remove addedServer at application boot
//alert("check removePropery");
/*
if (Ti.App.Properties.hasProperty('addedServers')) {
	//alert("cancella addedServers");
	Ti.App.Properties.removeProperty('addedServers');
}; */

var repos = [];


$.repo.title = Alloy.Globals.repository;

var NappSlideMenu = require('dk.napp.slidemenu');

var window = NappSlideMenu.createSlideMenuWindow({
    centerWindow:$.mainNavGroup,
    leftWindow:$.leftWindow,
    //rightWindow:$.rightWindow,
    leftLedge:100
});




$.leftTable.addEventListener("click", function(e){
	window.toggleLeftView();
	/*
	if (e.index == 0) {
		Alloy.Globals.repository = e.rowData.repo;
		$.repo.title = e.rowData.title;
		loadTypeList();
	} else {
		var wxs_client = Ti.UI.createWindow({
			url: "/windows/Settings.js",
			title: "Settings",
			backgroundImage: "/images/bgImage.png"
		});
		var navWin = Ti.UI.iOS.createNavigationWindow({
			modal:true,
			window: wxs_client
		});
		wxs_client.padre = navWin;
		navWin.open();
		//wxs_client.open({});
		//alert("loading WxS");
	} */
	Alloy.Globals.repository = e.rowData.repo;
	$.repo.title = e.rowData.title;
	loadTypeList();
	//alert("You clicked " + e.rowData.repo)
	/* switch(e.index){
		case 0:
			window.toggleLeftView();
			Alloy.Globals.repository = 'ESArep';
			loadTypeList();
			//alert("You clicked " + e.rowData.title)
			break;
		case 1:
			window.toggleLeftView();
			Alloy.Globals.repository = 'deroberto2';
			loadTypeList();
			//alert("You clicked " + e.rowData.title );
			break;
	} */
});


$.repo.addEventListener("focus", function() {
	Ti.API.info("focused");
	window.setPanningMode("FullViewPanning");
});

function openLeft(){
    window.toggleLeftView();
   
}
function openRight(){
    window.toggleRightView();
}

window.open(); //open the app
window.setCenterhiddenInteractivity("TouchDisabledWithTapToClose");
window.setParallaxAmount(0.4);
//window.bounceLeftView();
window.toggleLeftView();


function loadRepositories() {
	//alert("carico repos!");
	if (net.loggedIn) {
		$.leftTable.setData([]);
		var url = Alloy.Globals.gateway + 'glibrary/repositories/';
		net.apiCall(url, function(data) {
			//Ti.API.info(Ti.API.info(typeof response));
			//Ti.API.info(response);
			//var data = JSON.parse(response);
			for (var i=0, l=data.length; i<l; i++) {
				var row = Ti.UI.createTableViewRow({layout: "horizontal"});
				row.add(Ti.UI.createImageView({
					left: 5,
					height: 60,
					width: 60,
					borderRadius: 5,
					image: data[i].image 
				}));
				row.add(Ti.UI.createLabel({
					left: 5,
					text: data[i].text
				}));
				row.repo = data[i].repo;
				if (data[i].header) {
					row.header = data[i].header;
				}
				$.leftTable.appendRow(row);
			};
		});
	}
}
//$.index.open();
//$.downloadWin.getView().currentTab = $.index.activeTab;

function loadLoginWindow() {
	if (OS_IOS) {
		var loginWindow = Alloy.createController("LoginWindow").getView();
		loginWindow.open();
	} else {
		var federetionListWindow = Alloy.createController("federationList").getView();
		federetionListWindow.fullscreen = false;
		federetionListWindow.open();
	}
}

if (net.shibCookie) {
	if (new Date() > new Date(net.lastLogin + 3600000)) {
		loadLoginWindow();
	} else {
		net.loggedIn = true;
		
		//Ti.App.fireEvent("set:login", {
		$.username.text = net.username;
		//});
		loadRepositories();
		Ti.API.info("già loggato ");
	}
} else {
	loadLoginWindow();
}

if (!Ti.App.Properties.getBool("welcome_screen", true)) {
	var welcomeWindow = Alloy.createController("WelcomeScreen").getView();
	welcomeWindow.open();
}

Ti.App.addEventListener('loggedIn', function(e) {
	
	loadRepositories();
	loadTypeList();
	$.username.text = e.username;
});

function loadTypeList() {
	
	if (net.loggedIn) {
		var url = Alloy.Globals.gateway + 'glibrary/mountTree/' + Alloy.Globals.repository + "/?node=";
		net.apiCall(url + "0" , function(response) {
			//Ti.API.info(response);
			//alert(response);
			var data = [];
			for (var i = 0; i < response.length; i++) {
				var type = {};
				type.title = response[i].text;
				type.isLeaf = response[i].leaf;
				type.name = String(response[i].id);
				type.leftImage = "Folder-Add.png";
				type.height = 60;
				if (!type.isLeaf) {
					net.apiCall(url + response[i].id, function(response) {
						//Ti.API.info(response);
						for (var j = 0; j < response.length; j++) {
							var row = Ti.UI.createTableViewRow();
							row.add(Ti.UI.createLabel({
								text : response[j].text,
								left : 100,
								font : {
									fontSize : 18
								}
							}));
							row.add(Ti.UI.createImageView({
								image : "folder.png",
								width : 50,
								left : 50
							})); 
							//row.leftImage = "Folder-Add.png";
							row.id = "" + response[j].id;
							row.typename = response[j].text;
							row.path = response[j].path;
							row.visibleAttrs = response[j].visibleAttrs;
							row.hasChild = true;
							row.height = 60;
							//row.indentionLevel = 1;
							//row.title = row.typename;
							var parentID = response[j].parentID;
							//Ti.API.info(type.name);
							var previousRow = $.typesTableView.getIndexByName(parentID);
							//Ti.API.info(previousRow);
							$.typesTableView.insertRowAfter(previousRow, row);
						}
					});
				}
				type.typename = response[i].text;
				type.path = response[i].path;
				type.visibleAttrs = response[i].visibleAttrs;
				type.hasChild = true;
				//typesTableView.appendRow(type);
				data.push(type);
			}
			$.typesTableView.setData(data);
			//$.repo.title = Alloy.Globals.repository;
			//typesWindow.title = e.row.children[0].text;
			//repoNav.open(typesWindow);
		});
	}
}

function loadEntries(e) {
	Ti.API.info(e.rowData.path);
	//alert("visibleAttrs: " + e.rowData.visibleAttrs);
	var entryBrowser = Alloy.createController("entryBrowserWindow", {path: e.rowData.path, name: e.rowData.typename, visibleAttrs: e.rowData.visibleAttrs}).getView();
	entryBrowser.navGroup = $.mainNavGroup;
	window.setPanningMode("NavigationBarOrOpenCenterPanning");
	$.mainNavGroup.openWindow(entryBrowser);
}

function logout() {
	
	//net.loggedIn = false;
	net.lastLogin = Ti.App.Properties.setDouble("lastLogin", 0);
	net.username = Ti.App.Properties.setString("username", "none");    
	var path = Titanium.Filesystem.applicationDataDirectory;
	var searchKey = path.search('Documents');
	path = path.substring(0, searchKey);
	path = path + 'Library/Cookies/';
	//alert(path);
	var f = Ti.Filesystem.getFile(path + "Cookies.binarycookies");
	f.deleteFile();
	var loginWindow = Alloy.createController("LoginWindow").getView();
	loginWindow.open();
}

exports.close = function() {
	//Other cleanups here.
	$.index.close();
};