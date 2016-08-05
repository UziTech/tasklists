import {
	Meteor
} from "meteor/meteor";
import {
	Template
} from "meteor/templating";
import {
	Tasks
} from "../../api/tasks.js";
import Dates from "../../util/Dates.js";
import "./lists.html";
import "./lists.scss";

Template.lists.helpers({
	doneTasks() {
		return Tasks.find({
			doneAt: {
				$not: false
			}
		}, {
			sort: {
				doneAt: -1
			}
		});
	},
	lateTasks() {
		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					due: {
						$lt: Dates.today()
					}
				},
			]
		}, {
			sort: {
				start: -1,
				createdAt: -1,
			}
		});
	},
	todayTasks() {
		const today = Dates.today();

		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$lte: today
					}
				},
				{
					due: {
						$gte: today
					}
				},
		]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	tomorrowTasks() {
		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: Dates.tomorrow()
				},
			]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	thisweekTasks() {
		const thisWeek = Dates.thisWeek();
		if (thisWeek === false) {
			return [];
		}

		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$gte: thisWeek
					}
				},
				{
					start: {
						$lt: Dates.nextWeek()
					}
				},
			]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	nextweekTasks() {
		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$gte: Dates.nextWeek()
					}
				},
				{
					start: {
						$lt: Dates.thisMonth()
					}
				},
		]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	thismonthTasks() {
		const thisMonth = Dates.thisMonth();
		if (thisMonth === false) {
			return [];
		}

		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$gte: thisMonth
					}
				},
				{
					start: {
						$lt: Dates.nextMonth()
					}
				},
		]
		}, {
			sort: {
				priority: 1,
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	nextmonthTasks() {
		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$gte: Dates.nextMonth()
					}
				},
				{
					start: {
						$lt: Dates.later()
					}
				},
		]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
	laterTasks() {
		return Tasks.find({
			$and: [
				{
					doneAt: false
				},
				{
					start: {
						$gte: Dates.later()
					}
				},
		]
		}, {
			sort: {
				priority: 1,
				start: -1,
				createdAt: -1,
			}
		});
	},
});

Template.lists.events({
	"click .list h1" (e) {
		const list = e.target.closest(".list");
		var active = list.classList.contains("active");
		var userOpen = list.classList.contains("user-open");
		var userClosed = list.classList.contains("user-closed");
		if (userOpen || (active && !userClosed)) {
			list.classList.remove("user-open");
			list.classList.add("user-closed");
		} else {
			list.classList.remove("user-closed");
			list.classList.add("user-open");
		}
	}
});
