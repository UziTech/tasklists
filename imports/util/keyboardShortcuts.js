import { Meteor } from "meteor/meteor";

if (Meteor.isClient) {
	Meteor.startup(function () {
		$(window).on("keydown", function (e) {
			// cannot bind Ctrl(+Shift)?+(n|t|w) https://bugs.chromium.org/p/chromium/issues/detail?id=5496

			// TODO: f1: help dialog
			// TODO: Ctrl + f: search
			// TODO: arrows|home|end depend on e.target
			// f2: focus #newTask
			if (e.which === 113) {
				e.preventDefault();
				$("#newTask input").focus().select();
			}
		});
	});
}
