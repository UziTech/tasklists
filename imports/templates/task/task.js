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
