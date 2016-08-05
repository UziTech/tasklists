import {
	Meteor
} from "meteor/meteor";
import {
	Tasks
} from "../imports/api/tasks";

Meteor.startup(() => {
	
	// denay updating user profiles
	Meteor.users.deny({
		update: function () {
			return true;
		}
	});
});
