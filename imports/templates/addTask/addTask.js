import {
	Meteor
} from "meteor/meteor";
import {
	Template
} from "meteor/templating";
import {
	getDay,
	addDays
} from "../../util/Dates.js";

import "./addTask.html";
import "./addTask.scss";

Template.addTask.events({
	"submit form" (e) {
		e.preventDefault();

		const name = e.target.name.value;
		const start = getDay(new Date());
		const due = addDays(start, 1);
		const priority = 1;
		const project = "";

		Meteor.call("tasks.insert", name, start, due, priority, project);

		e.target.reset();
	}
});
