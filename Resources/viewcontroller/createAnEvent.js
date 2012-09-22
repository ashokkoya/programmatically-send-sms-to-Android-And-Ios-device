function viewController() {

	var win = Titanium.UI.createWindow({
		backgroundColor : '#fff'
	});
	if (Ti.Platform.osname != 'android') {
		win.navBarHidden = true;
	}

	var navBar = Titanium.UI.createView({
		left : 0,
		top : 0,
		height : 44,
		width : Ti.Platform.displayCaps.platformWidth,
	});
	win.add(navBar);

	var navTitleContainer = Ti.UI.createView({
		width : Ti.UI.SIZE,
		top : 5,
		layout : "horizontal"
	});
	navBar.add(navTitleContainer);

	var navTitle1 = Ti.UI.createLabel({
		text : 'Create An SMS',
		width : Ti.UI.SIZE,
		top : 0,
		left : 0,
	});
	navTitleContainer.add(navTitle1);

	var container = Titanium.UI.createView({
		left : 8,
		top : 55,
		right : 8,
		height : 305,
		backgroundColor : 'white'
	});
	win.add(container);

	var wapperView = Ti.UI.createScrollView({
		layout : 'vertical',
		left : 10,
		right : 10,
		top : 20,
		bottom : 20,
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true
	});
	container.add(wapperView);

	var descriptionLabel = Ti.UI.createLabel({
		text : 'Description : ',
		textAlign : 'left',
		color : 'black',
		left : 0
	});
	wapperView.add(descriptionLabel);

	var descriptionText = Ti.UI.createTextField({
		left : 0,
		top : 4,
		right : 0,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	wapperView.add(descriptionText);

	var toView = Ti.UI.createView({
		layout : 'horizontal',
		left : 10,
		right : 10,
		top : 5,
		width : 'auto',
		height : 60,
	});
	wapperView.add(toView);

	var toBtn = Ti.UI.createButton({
		title : 'To',
		top : 10,
		left : 0,
		width : 50
	});
	toView.add(toBtn);

	var info = Ti.UI.createLabel({
		text : '',
		left : 4,
		top : 15,
		height : 'auto',
		width : 'auto'
	});
	toView.add(info);

	var phone = Ti.UI.createLabel({
		text : '',
		left : 5,
		top : 15,
		height : 'auto',
		width : 'auto'
	});
	toView.add(phone);

	toBtn.addEventListener('click', function() {

		var values = {
			cancel : function() {
				info.text = 'Cancelled';
			}
		};

		values.selectedPerson = function(e) {
			info.text = e.person.fullName;
			if (Ti.Platform.osname == 'android') {
				if (e.person.phone.mobile) {
					phone.text = e.person.phone.mobile[0].toString();
				}
			} else {
				phone.text = e.person.phone.mobile.toString();
			}
		};
		Titanium.Contacts.showContacts(values);
	});
	
	var SendBtn = Ti.UI.createButton({
		title : 'Send Sms',
		top : 10,
		left : 100
	});

	SendBtn.addEventListener('click', function() {

		if (Ti.Platform.osname == 'android') {
			var intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				type : 'vnd.android-dir/mms-sms',
			});
			intent.putExtra('sms_body', descriptionText.value);
			intent.putExtra('address', phone.text);
			try {
				Ti.Android.currentActivity.startActivity(intent);
			} catch (ActivityNotFoundException) {
				Ti.UI.createNotification({
					message : "Error"
				}).show();
			}
		} else {
			var moduleObj = require("com.omorandi");
			
			smsDialog = moduleObj.createSMSDialog({
				recipients : [phone.text],
				messageBody : descriptionText.value
			});
			smsDialog.open({
				animated : true
			});
		}
	});

	wapperView.add(SendBtn);

	win.open();
}

module.exports = viewController;
