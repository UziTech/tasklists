import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.methods({
	"users.profile.defaultColor" (color) {
		check(color, String);

		Meteor.users.update(Meteor.userId(), {
			$set: {
				"profile.defaultColor": color
			}
		});
	},
});
