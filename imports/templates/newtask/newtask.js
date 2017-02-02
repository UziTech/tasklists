import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import Dates from "../../util/Dates";
import Cursor from "../../util/Cursor";

import "./newtask.html";
import "./newtask.scss";

function allowIBUtags(html) {
	return sanitizeHtml(html, ["i", "em", "b", "strong", "u"]);
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
	"click .ellip" (e) {
		const $controls = $(e.target).closest(".controls");
		const isOpen = $controls.hasClass("open");
		$(".open").removeClass("open");
		if (!isOpen) {
			$controls.addClass("open");
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
	"click .color-button" (e) {
		Meteor.call("users.profile.defaultColor", e.target.dataset.color);
	},
	"focus .name" (e) {
		$(e.target).closest(".task.new").addClass("focus");
	},
	"blur .name" (e) {
		$(e.target).closest(".task.new").removeClass("focus");
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
			const name = allowIBUtags(e.target.innerHTML);
			if (!name) {
				return;
			}
			const start = Dates.getDateFromList(e.target.dataset.list);
			const due = Dates.addDays(start, 1);
			const priority = 1;
			const project = "";
			const color = Meteor.user().profile.defaultColor;
			const list = e.target.dataset.list;

			const rect = Cursor.getSelectionRect();
			e.target.innerHTML = "";

			Meteor.call("tasks.insert", name, start, due, priority, project, color, function (err, insertId) {
				if (err) {
					console.log(err);
					e.target.innerHTML = name;
					return;
				}
				Cursor.setCursorAtPoint(rect.left, rect.top);
				// FIXME: won't work with selection
			});
		}, 350);
	},
});
