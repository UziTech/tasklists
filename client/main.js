import { Template } from "meteor/templating";

import  "../imports/templates/addTask/addTask.js";
import  "../imports/templates/lists/lists.js";
import "../imports/util/keyboardShortcuts.js";

Template.body.events({
	"focus, click" (e) {

		// close any open controls on focusing/clicking something else
		if (!e.target.closest(".controls")) {
			$(".open").removeClass("open");
		}
	},
});
