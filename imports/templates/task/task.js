import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import Dates from "../../util/Dates";

import "./task.html";
import "./task.scss";

function allowIBtags(html) {
	return sanitizeHtml(html, ["i", "b"]);
}
/**
 * Sanatize html tags
 * @param  {string} html HTML to sanitize
 * @param  {string|string[]} allowedTags The tags to allow in the HTML
 * @return {string} The HTML with the start of unwanted tags changed to &lt;
 */
function sanitizeHtml(html, allowedTags) {
	if (!(allowedTags instanceof Array)) {
		allowedTags = (typeof allowedTags === "string" ? allowedTags.split(" ") : []);
	}
	return html.replace(/(<)(\/?)(\w*)/g, function (match, p1, p2, p3) {
		if (!allowedTags.includes(p3)) {
			p1 = "&lt;";
		}
		return p1 + p2 + p3;
	});
}

Meteor.startup(function () {

	// store clientId for task.lastClientId to prevent multiple people editing the same task
	Session.set("clientId", Random.id());

	// load the toTextarea plugin
	$.getScript("/js/jquery.toTextarea.js", function () {

		// enable the plugin on .name elements that are already rendered
		$(".task .name").toTextarea({
			allowHTML: true,
			allowImg: false,
		});
	});
});

Template.task.onRendered(function () {
	const $name = $(this.find(".name"));

	// set the text to the data-name attribute value
	// which is the reactive name
	$name.html(allowIBtags($name.data().name));

	// if toTextarea plugin is loaded enable it
	if ($name.toTextarea) {
		$name.toTextarea({
			allowHTML: true,
			allowImg: false,
		});
	}
});

Template.task.helpers({
	isDone(){
		return !!this.doneAt;
	},
	dataName() {

		// check if this .name has focus
		const $name = $("#" + this._id + " .name");
		if (!$name.is(":focus")) {

			// set .name text to this.name
			$name.html(allowIBtags(this.name));
		} else if (this.lastClientId !== Session.get("clientId") && allowIBtags(this.name) !== $name.html()) {

			// blur .name and set text to this.name
			$name.blur().html(allowIBtags(this.name));
		}

		return allowIBtags(this.name);
	}
});

Template.task.events({
	"click .ellip" (e) {
		const $controls = $(e.target).closest(".controls");
		const isOpen = $controls.hasClass("open");
		$(".open").removeClass("open");
		if (!isOpen) {
			$controls.addClass("open");
		}
	},
	"click .move" (e) {
		const $controls = $(e.target).closest(".controls");
		const $moveButtons = $controls.find(".move-buttons");
		const isOpen = $moveButtons.hasClass("open");
		$(".open").removeClass("open");
		$controls.addClass("open");
		if (!isOpen) {
			$moveButtons.addClass("open");
		}
	},
	"click .color" (e) {
		const $controls = $(e.target).closest(".controls");
		const $colorButtons = $controls.find(".color-buttons");
		const isOpen = $colorButtons.hasClass("open");
		$(".open").removeClass("open");
		$controls.addClass("open");
		if (!isOpen) {
			$colorButtons.addClass("open");
		}
	},
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

		if (Session.equals("allowHotCodePush", true)) {

			// dont-allow hot code push when typing
			Session.set("allowHotCodePush", false);
			$(e.target).one("blur", function () {
				Session.set("allowHotCodePush", true);
			});
		}

		if (this.changeTimeout) {
			Meteor.clearTimeout(this.changeTimeout);
		}
		const task = this;
		this.changeTimeout = Meteor.setTimeout(function () {
			Meteor.call("tasks.edit", task._id, allowIBtags(e.target.innerHTML), Session.get("clientId"));
		}, 350);
	},
});
