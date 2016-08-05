import {
	Meteor
} from "meteor/meteor";
import {
	Session
} from "meteor/session";
import {
	Template
} from "meteor/templating";
import {
	getDay,
	addDays
} from "../../util/Dates.js";

import "./addTask.html";
import "./addTask.scss";

Meteor.startup(function () {
	Session.setDefault("defaultColor", "");
});

Template.addTask.helpers({
	defaultColor() {
		return Session.get("defaultColor");
	}
});

Template.addTask.events({
	"submit form" (e) {
		e.preventDefault();
		const name = e.target.elements.name.value.trim();
		if (!name) {
			return;
		}
		const start = getDay(new Date());
		const due = addDays(start, 1);
		const priority = 1;
		const project = "";
		const color = Session.get("defaultColor");

		Meteor.call("tasks.insert", name, start, due, priority, project, color);

		e.target.reset();
		e.target.elements.name.focus();
	},
	"click .color button" (e, template) {
		Session.set("defaultColor", e.target.dataset.color);
		template.$("form").submit();
	},
	"click #bulk-edit" () {
		$(".open").removeClass("open");
		$(document.body).toggleClass("bulk-edit");
	}

});
