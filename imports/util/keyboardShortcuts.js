import { Meteor } from "meteor/meteor";

function shouldMoveToPrev($name) {
	return false;
}

function shouldMoveToNext($name) {
	return false;
}

function shouldMoveToDefaultColor($input) {
	return false;
}

if (Meteor.isClient) {
	Meteor.startup(function () {
		$(window).on("keydown", function (e) {
			// cannot bind Ctrl(+Shift)?+(n|t|w) https://bugs.chromium.org/p/chromium/issues/detail?id=5496

			// TODO: f1: help dialog
			// TODO: Ctrl + f: search
			// TODO: arrows|home|end depend on e.target
			let $target
			switch (e.which) {
				case 113:
					// f2
					e.preventDefault();
					$("#new-task input").focus().select();
					break;
				case 35:
					// end
					$target = $(e.target);
					if ($target.is(".move-buttons button")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.addClass("open").find("button").last().focus();
					} else if ($target.is(".color-buttons button")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.addClass("open").find("button").last().focus();
					}
					break;
				case 36:
					// home
					$target = $(e.target);
					if ($target.is(".move-buttons button")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.removeClass("open").find("button").first().focus();
					} else if ($target.is(".color-buttons button")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.removeClass("open").find("button").first().focus();
					}
					break;
				case 37:
					// left
					$target = $(e.target);
					if ($target.hasClass("done")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".delete").focus();
					} else if ($target.hasClass("color")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".done").focus();
					} else if ($target.hasClass("move")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".color").focus();
					} else if ($target.hasClass("ellip")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.addClass("open").find(".move").focus();
					} else if ($target.hasClass("default-color")) {
						e.preventDefault();
						$("#new-task input").focus().select();
					} else if ($target.is("#bulk-edit")) {
						e.preventDefault();
						$("#add-task").find(".default-color").focus();
					}
					break;
				case 38:
					// up
					$target = $(e.target);
					if ($target.hasClass("name")) {
						if (shouldMoveToNext($target)) {
							e.preventDefault();
							const $task = $target.closest(".task");
							$task.prev().find(".name").focus();
						}
					} else if ($target.hasClass("move-button")) {
						e.preventDefault();
						const $prev = $target.prev(".move-button");
						if ($prev.length > 0) {
							$prev.focus();
						} else {
							const $moveButtons = $target.closest(".move-buttons");
							$moveButtons.removeClass("open").children("button").focus();
						}
					} else if ($target.hasClass("color-button")) {
						e.preventDefault();
						const $prev = $target.prev(".color-button");
						if ($prev.length > 0) {
							$prev.focus();
						} else {
							const $colorButtons = $target.closest(".color-buttons");
							$colorButtons.removeClass("open").children("button").focus();
						}
					}
					break;
				case 39:
					// right
					$target = $(e.target);
					if ($target.hasClass("delete")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".done").focus();
					} else if ($target.hasClass("done")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".color").focus();
					} else if ($target.hasClass("color")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".move").focus();
					} else if ($target.hasClass("move")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$(".open").removeClass("open");
						$controls.find(".ellip").focus();
					} else if ($target.is("#new-task input")) {
						if (shouldMoveToDefaultColor($target)) {
							e.preventDefault();
							$("#add-task").find(".default-color").focus();
						}
					} else if ($target.hasClass("default-color")) {
						e.preventDefault();
						$("#bulk-edit").focus().select();
					}
					break;
				case 40:
					// down
					$target = $(e.target);
					if ($target.hasClass("name")) {
						if (shouldMoveToNext($target)) {
							e.preventDefault();
							const $task = $target.closest(".task");
							$task.next().find(".name").focus();
						}
					} else if ($target.hasClass("move")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.addClass("open").find(".move-button").eq(0).focus();
					} else if ($target.hasClass("move-button")) {
						e.preventDefault();
						$target.next(".move-button").focus();
					} else if ($target.hasClass("color") || $target.hasClass("default-color")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.addClass("open").find(".color-button").eq(0).focus();
					} else if ($target.hasClass("color-button")) {
						e.preventDefault();
						$target.next(".color-button").focus();
					}
					break;
				default:
					// nothing
			}
		});
	});
}
