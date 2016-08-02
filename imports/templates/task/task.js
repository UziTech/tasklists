import {
	Meteor
} from "meteor/meteor";
import {
	Template
} from "meteor/templating";
import Dates from "../../util/Dates.js";
import "./task.html";
import "./task.scss";

// Template.task.helpers({
// });

Template.task.events({
	"change .done" (e) {
		Meteor.call("tasks.done", this._id, e.target.checked);
	},
	"click .now" () {
		if (!this.done) {
			const start = Dates.today();
			const due = Dates.addDays(this.due, Dates.daysDiff(start, this.start));

			Meteor.call("tasks.update", this._id, start, due);
		}
	},
	"click .advance" (e) {
		if (!this.done) {
			const list = e.target.closest(".list");
			if (!list) {
				throw "Not in a list! Something went wrong!";
			}

			let start;
			switch (list.id) {
				case "tomorrow":
					start = Dates.today();
					break;
				case "thisweek":
					start = Dates.tomorrow();
					break;
				case "nextweek":
					start = Dates.thisWeek() || Dates.tomorrow();
					break;
				case "thismonth":
					start = Dates.nextWeek();
					break;
				case "nextmonth":
					start = Dates.thisMonth() || Dates.nextWeek();
					break;
				case "later":
					start = Dates.nextMonth();
					break;
				default:
					return;
			}

			const due = Dates.addDays(this.due, Dates.daysDiff(start, this.start));

			Meteor.call("tasks.update", this._id, start, due);
		}
	},
	"click .postpone" (e) {
		if (!this.done) {
			const list = e.target.closest(".list");
			if (!list) {
				throw "Not in a list! Something went wrong!";
			}

			let start;
			switch (list.id) {
				case "late":
					start = Dates.today();
					break;
				case "today":
					start = Dates.tomorrow();
					break;
				case "tomorrow":
					start = Dates.thisWeek() || Dates.nextWeek();
					break;
				case "thisweek":
					start = Dates.nextWeek();
					break;
				case "nextweek":
					start = Dates.thisMonth() || Dates.nextMonth();
					break;
				case "thismonth":
					start = Dates.nextMonth();
					break;
				case "nextmonth":
					start = Dates.later();
					break;
				default:
					return;
			}

			const due = Dates.addDays(this.due, Dates.daysDiff(start, this.start));

			Meteor.call("tasks.update", this._id, start, due);
		}
	},
	"click .delete" () {
		Meteor.call("tasks.delete", this._id);
	},
	"click .name" (e) {
		alert(this.name);
	},
});
