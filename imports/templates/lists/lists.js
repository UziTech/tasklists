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
			done: true
		});
	},
	lateTasks() {
		return Tasks.find({
			$and: [
				{
					done: false
				},
				{
					due: {
						$lt: Dates.today()
					}
				},
			]
		});
	},
	todayTasks() {
		const today = Dates.today();

		return Tasks.find({
			$and: [
				{
					done: false
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
		});
	},
	tomorrowTasks() {
		return Tasks.find({
			$and: [
				{
					done: false
				},
				{
					start: Dates.tomorrow()
				},
		]
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
					done: false
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
		});
	},
	nextweekTasks() {
		return Tasks.find({
			$and: [
				{
					done: false
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
					done: false
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
		});
	},
	nextmonthTasks() {
		return Tasks.find({
			$and: [
				{
					done: false
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
		});
	},
	laterTasks() {
		return Tasks.find({
			$and: [
				{
					done: false
				},
				{
					start: {
						$gte: Dates.later()
					}
				},
		]
		});
	},
});

Template.lists.events({
	"click .list h1" (e) {
		const list = e.target.closest(".list");
		list.classList.toggle("active");
	}
});
