
$.welcomeSwitch.value = Ti.App.Properties.getBool("welcome_screen", true);


function signIn() {
	$.WelcomeScreen.close();
}

function register() {
	Ti.Platform.openURL("https://idpopen.garr.it/register");
}

function gotoESprojectSG() {
	Ti.Platform.openURL("https://ecsg.dch-rp.eu/");
}

function gotoESproject() {
	Ti.Platform.openURL("http://http://www.dch-rp.eu/");
}

function dismissWelcomeScreen(e) {
		Ti.App.Properties.setBool("welcome_screen", e.value);
}
