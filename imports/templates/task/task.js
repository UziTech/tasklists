import {
	Meteor
} from "meteor/meteor";
import {
	Random
} from "meteor/random";
import {
	Session
} from "meteor/session";
import {
	Template
} from "meteor/templating";
import Dates from "../../util/Dates.js";
import "./task.html";
import "./task.scss";

Meteor.startup(function () {

	// store clientId for task.lastClientId to prevent multiple people editing the same task
	Session.set("clientId", Random.id());

	// load the toTextarea plugin
	$.getScript("/js/jquery.toTextarea.js", function () {

		// enable the plugin on .name elements that are already rendered
		$(".task .name").toTextarea();
	});
});

Template.task.onRendered(function () {
	var $name = $(this.find(".name"));

	// set the text to the data-name attribute value
	// which is the reactive name
	$name.text($name.data().name);

	// if toTextarea plugin is loaded enable it
	if ($name.toTextarea) {
		$name.toTextarea();
	}
});

Template.task.helpers({
	dataName() {

		// check if this .name has focus
		var $name = $("#" + this._id + " .name");
		if (!$name.is(":focus")) {

			// set .name text to this.name
			$name.text(this.name);
		} else if (this.lastClientId !== Session.get("clientId") && this.name !== $name.text()) {

			// blur .name and set text to this.name
			$name.blur().text(this.name);
		}

		return this.name;
	}
});

Template.task.events({
	"click .done" () {
		Meteor.call("tasks.done", this._id, !this.doneAt);
	},
	"click .move-button" (e) {
		if (!this.done) {
			let start;
			switch (e.target.dataset.list) {
				case "today":
					start = Dates.today();
					break;
				case "tomorrow":
					start = Dates.tomorrow();
					break;
				case "thisweek":
					start = Dates.thisWeek() || Dates.nextWeek();
					break;
				case "nextweek":
					start = Dates.nextWeek();
					break;
				case "thismonth":
					start = Dates.thisMonth() || Dates.nextMonth();
					break;
				case "nextmonth":
					start = Dates.nextMonth();
					break;
				case "later":
					start = Dates.later();
					break;
				default:
					return;
			}

			const due = Dates.addDays(this.due, Dates.daysDiff(start, this.start));

			Meteor.call("tasks.move", this._id, start, due);
		}
	},
	"click .delete" () {
		Meteor.call("tasks.delete", this._id);
	},
	"click .color-button" (e) {
		Meteor.call("tasks.color", this._id, e.target.dataset.color);
	},
	"input .name" (e) {
		if (this.changeTimeout) {
			Meteor.clearTimeout(this.changeTimeout);
		}
		const task = this;
		this.changeTimeout = Meteor.setTimeout(function () {
			Meteor.call("tasks.edit", task._id, e.target.textContent, Session.get("clientId"));
		}, 350);
	},
	"change .name" (e) {
		Meteor.call("tasks.edit", this._id, e.target.textContent, Session.get("clientId"));
	},
});
