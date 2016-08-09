import {
	Meteor
} from "meteor/meteor";
import "../imports/api/tasks";
import "../imports/api/profile";

Meteor.startup(() => {

	// denay updating user profiles
	Meteor.users.deny({
		update: function () {
			return true;
		}
	});
});
