import { Template } from "meteor/templating";
import { Tasks } from "../../api/tasks";
import Dates from "../../util/Dates";

import "./list.html";
import "./list.scss";
import "../task/task";
import "../newtask/newtask";

function titleToName(title) {
	return title.toLowerCase().replace(/\W/g, "");
}

function getTasks(title) {
	const name = titleToName(title);
	switch (name) {
		case "done":
			{
				return Tasks.find({
					doneAt: {
						$not: false
					}
				}, {
					sort: {
						doneAt: -1
					}
				});
			}
		case "late":
			{
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
			}
		case "today":
			{
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
						createdAt: 1,
					}
				});
			}
		case "tomorrow":
			{
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
						createdAt: 1,
					}
				});
			}
		case "thisweek":
			{
				const thisWeek = Dates.thisWeek();
				if (thisWeek === false) {
					return null;
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
						createdAt: 1,
					}
				});
			}
		case "nextweek":
			{
				const thisMonth = Dates.thisMonth();
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
								$lt: (thisMonth === false ? Dates.nextMonth() : thisMonth)
							}
					},
			]
				}, {
					sort: {
						priority: 1,
						start: -1,
						createdAt: 1,
					}
				});
			}
		case "thismonth":
			{
				const thisMonth = Dates.thisMonth();
				if (thisMonth === false) {
					return null;
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
						start: -1,
						createdAt: 1,
					}
				});
			}
		case "nextmonth":
			{
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
						createdAt: 1,
					}
				});
			}
		case "later":
			{
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
						createdAt: 1,
					}
				});
			}
		default:
			// nothing
	}
}

Template.list.helpers({
	name() {
		return titleToName(this.title);
	},
	showNewTask() {
		return !["Done", "Late"].includes(this.title);
	},
	listActive() {
		const tasks = getTasks(this.title);
		return tasks && tasks.count() > 0 && ["Today", "Late"].includes(this.title);
	},
	tasksCount() {
		const tasks = getTasks(this.title);
		return (tasks ? tasks.count() : 0);
	},
	tasks() {
		return getTasks(this.title);
	},
});

Template.list.events({
	"click" (e) {
		const $list = $(e.target).closest(".list");
		const isOpen = $list.hasClass("user-open") || ($list.hasClass("active") && !$list.hasClass("user-closed"));

		if (isOpen) {
			if ($(e.target).closest(".header").length > 0) {
				$list.removeClass("user-open").addClass("user-closed");
			}
		} else {
			$list.removeClass("user-closed").addClass("user-open");
		}
	}
});
