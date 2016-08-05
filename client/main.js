import {
	Template
} from "meteor/templating";
import {
	addTask
} from "../imports/templates/addTask/addTask.js";
import {
	lists
} from "../imports/templates/lists/lists.js";

Template.body.events({
	"focus, click" (e) {

		// close any open controls on focusing/clicking something else
		if (!e.target.closest(".controls")) {
			$(".open").removeClass("open");
		}
	},
});
