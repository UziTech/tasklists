import {
	Meteor
} from "meteor/meteor";
import {
	Template
} from "meteor/templating";
import Dates from "../../util/Dates.js";
import "./task.html";
import "./task.scss";

Meteor.startup(function () {
	$.getScript("/js/jquery.toTextarea.js", function () {
		$(".task .name").toTextarea();
	});
});

Template.task.onRendered(function () {
	// var name = this.find(".name");
	// name.innerHTML = name.dataset.name;
	var $name = $(this.find(".name"));
	$name.text($name.data().name);

	if ($name.toTextarea) {
		$name.toTextarea();
	}
});

Template.task.helpers({
	name: function () {

		var $name = $(".task[data-id='" + this._id + "'] .name");
		var focus = $name.is(":focus");
		if (!focus) {
			$name.text(this.name);
		}

		return this.name;
	}
});

Template.task.events({
	"change .done" (e) {
		Meteor.call("tasks.done", this._id, e.target.checked);
	},
	"click .move-to" (e) {
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
	"input .name" (e) {
		if (this.changeTimeout) {
			Meteor.clearTimeout(this.changeTimeout);
		}
		const task = this;
		this.changeTimeout = Meteor.setTimeout(function () {
			Meteor.call("tasks.edit", task._id, e.target.textContent);
		}, 350);
	},
	"change .name" (e) {
		Meteor.call("tasks.edit", this._id, e.target.textContent);
	},
	"blur .name" (e) {
		var $name = $(e.target);
		$name.text($name.data().name);
	},
});
