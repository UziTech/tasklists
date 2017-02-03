import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";

import "./help.html";
import "./help.scss";

let transitioning = false;
let $overlay;
let $dialog;

function showDialog() {
	if (!transitioning && $overlay.hasClass("hide")) {
		transitioning = true;
		$("body").disableTabindex();
		$dialog.disableTabindex(true);
		$overlay.css({
			opacity: 0
		});
		$dialog.css({
			top: -30
		});
		$overlay.removeClass("hide");
		$overlay.animate({ opacity: 1 }, {
			duration: 300,
			// easing: "linear",
			queue: false,
		});
		$dialog.animate({ top: 0 }, {
			duration: 500,
			queue: false,
			complete: function () {
				transitioning = false;
			}
		});
	}
}

function hideDialog() {
	if (!transitioning && !$overlay.hasClass("hide")) {
		transitioning = true;
		$("body").disableTabindex(true);
		$dialog.disableTabindex();
		$dialog.animate({ top: -30 }, {
			duration: 500,
			queue: false,
		});
		setTimeout(function () {
			$overlay.animate({ opacity: 0 }, {
				duration: 300,
				// easing: "linear",
				queue: false,
				complete: function () {
					$overlay.addClass("hide");
					transitioning = false;
				}
			});
		}, 200);
	}
}

Template.help.onRendered(function () {
	$overlay = this.$(".overlay");
	$dialog = this.$(".dialog");

	$dialog.disableTabindex();
});

Template.help.events({
	"click .help-button" () {
		showDialog();
	},
	"click .overlay" (e) {
		if ($(e.target).hasClass("overlay")) {
			hideDialog();
		}
	},
});
