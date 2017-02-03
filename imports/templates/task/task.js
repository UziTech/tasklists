import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import Dates from "../../util/Dates";
import Html from "../../util/Html";

import "./task.html";
import "./task.scss";

Meteor.startup(function () {

	// store clientId for task.lastClientId to prevent multiple people editing the same task
	Session.set("clientId", Random.id());

});

Template.task.onRendered(function () {
	const $name = $(this.find(".name"));

	// set the text to the data-name attribute value
	// which is the reactive name
	$name.html(Html.allowIBUtags($name.data().name));

	$name.toTextarea({
		allowHTML: true,
		allowImg: false,
	});
});

Template.task.helpers({
	isDone() {
		return !!this.doneAt;
	},
	dataName() {

		// check if this .name has focus
		const $name = $("#" + this._id + " .name");
		if (!$name.is(":focus")) {

			// set .name text to this.name
			$name.html(Html.allowIBUtags(this.name));
		} else if (this.lastClientId !== Session.get("clientId") && Html.allowIBUtags(this.name) !== $name.html()) {

			// blur .name and set text to this.name
			$name.blur().html(Html.allowIBUtags(this.name));
		}

		return Html.allowIBUtags(this.name);
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
			const start = Dates.getDateFromList(e.target.dataset.list);
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
			Meteor.call("tasks.edit", task._id, Html.allowIBUtags(e.target.innerHTML), Session.get("clientId"));
		}, 350);
	},
});
