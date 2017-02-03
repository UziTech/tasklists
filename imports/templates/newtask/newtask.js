import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import Dates from "../../util/Dates";
import Cursor from "../../util/Cursor";
import Html from "../../util/Html";

import "./newtask.html";
import "./newtask.scss";

Template.newtask.onRendered(function () {
	const $name = $(this.find(".name"));

	$name.toTextarea({
		allowHTML: true,
		allowImg: false,
	});
});

Template.newtask.helpers({
	defaultColor() {
		return Meteor.user().profile.defaultColor;
	}
});

Template.newtask.events({
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
	"click .color-button" (e) {
		Meteor.call("users.profile.defaultColor", e.target.dataset.color);
	},
	"focus .name" (e) {
		$(e.target).closest(".task.new").addClass("focus");
	},
	"blur .name" (e) {
		$(e.target).closest(".task.new").removeClass("focus");

		const name = Html.allowIBUtags(e.target.innerHTML);
		e.target.innerHTML = "";

		if (!name) {
			return;
		}
		const start = Dates.getDateFromList(e.target.dataset.list);
		const due = Dates.addDays(start, 1);
		const priority = 1;
		const project = "";
		const color = Meteor.user().profile.defaultColor;
		const list = e.target.dataset.list;

		Meteor.call("tasks.insert", name, start, due, priority, project, color, function (err, insertId) {
			if (err) {
				console.log(err);
				e.target.innerHTML = name;
				return;
			}
		});
	},
	"input .name" (e) {

		if (Session.equals("allowHotCodePush", true)) {

			// dont-allow hot code push when typing
			Session.set("allowHotCodePush", false);
			$(e.target).one("blur", function () {
				Session.set("allowHotCodePush", true);
			});
		}
	},
});
