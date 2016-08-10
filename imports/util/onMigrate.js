import { Reload } from "meteor/reload";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";

Session.set("allowHotCodePush", true);
let retryFn = null;

Reload._onMigrate(function (retry) {
	if (Session.equals("allowHotCodePush", true)) {
		return [true, {}];
	}
	console.log("Hot Code Push Ready!!!!");
	retryFn = retry;
	return [false];
});

Tracker.autorun(function () {
	if (Session.equals("allowHotCodePush", true) && retryFn) {
		retryFn();
	}
});
