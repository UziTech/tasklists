import {
	Meteor
} from "meteor/meteor";
import {
	Template
} from "meteor/templating";
import {
	addTask
} from "../imports/templates/addTask/addTask.js";
import {
	lists
} from "../imports/templates/lists/lists.js";
import {
	task
} from "../imports/templates/task/task.js";
import Dates from "../imports/util/Dates.js";

import {Tasks} from "../imports/api/tasks.js";

Template.body.onCreated(function () {
	Meteor.subscribe("tasks");
	if (window) {
		window.Tasks = Tasks;
	}
});
