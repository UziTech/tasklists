import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { getDay, addDays } from "../../util/Dates.js";

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
	"submit #new-task" (e) {
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
	"click .default-color" (e) {
		var $controls = $(e.target).closest(".controls");
		var isOpen = $controls.hasClass("open");
		$(".open").removeClass("open");
		if (isOpen) {
			$("#new-task").submit();
		} else {
			$controls.addClass("open");
		}
	},
	"click .color-button" (e) {
		$(".open").removeClass("open");
		Session.set("defaultColor", e.target.dataset.color);
		$("#new-task").submit();
	},
	"click #bulk-edit" () {
		$(document.body).toggleClass("bulk-edit");
	}

});
