import { Meteor } from "meteor/meteor";
import Cursor from "./Cursor";

if (Meteor.isClient) {
	Meteor.startup(function () {
		$(window).on("keydown", function (e) {
			// cannot bind Ctrl(+Shift)?+(n|t|w) https://bugs.chromium.org/p/chromium/issues/detail?id=5496

			// TODO: Ctrl + f: search
			const $target = $(e.target);
			switch (e.which) {
				case 71:
					// g
					if (e.ctrlKey) {
						e.preventDefault();
						console.log(Cursor.getSelectionRect());
					}
					break;
				case 112:
					// f1
					e.preventDefault();
					$("#help .help-button").click();
				case 27:
					// esc
					$("#help .overlay").click();
					break;
				case 35:
					// end
					if ($target.is(".controls .move-buttons button")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.addClass("open").find("button").last().focus();
					} else if ($target.is(".controls .color-buttons button")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.addClass("open").find("button").last().focus();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 36:
					// home
					if ($target.is(".controls .move-buttons button")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.removeClass("open").find("button").first().focus();
					} else if ($target.is(".controls .color-buttons button")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.removeClass("open").find("button").first().focus();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 37:
					// left
					if ($target.is(".controls .done")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".delete").focus();
					} else if ($target.is(".controls .color")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".done").focus();
					} else if ($target.is(".controls .move")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".color").focus();
					} else if ($target.is(".controls .ellip")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.addClass("open");
						const $move = $controls.find(".move");
						if ($move.length > 0) {
							$move.focus();
						} else {
							$controls.find(".color").focus();
						}
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 38:
					// up
					if ($target.is(".task .name")) {
						if ($target.length > 0 && Cursor.isCursorOnFirstLine($target[0])) {
							e.preventDefault();
							const $task = $target.closest(".task").prev();
							if ($task.length > 0) {
								Cursor.setCursorOnLastLine($task.find(".name")[0]);
							}
						}
					} else if ($target.is(".controls .move-button")) {
						e.preventDefault();
						const $prev = $target.prev(".move-button");
						if ($prev.length > 0) {
							$prev.focus();
						} else {
							const $moveButtons = $target.closest(".move-buttons");
							$moveButtons.removeClass("open").children("button").focus();
						}
					} else if ($target.is(".controls .color-button")) {
						e.preventDefault();
						const $prev = $target.prev(".color-button");
						if ($prev.length > 0) {
							$prev.focus();
						} else {
							const $colorButtons = $target.closest(".color-buttons");
							$colorButtons.removeClass("open").children("button").focus();
						}
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 39:
					// right
					if ($target.is(".controls .delete")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".done").focus();
					} else if ($target.is(".controls .done")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$controls.find(".color").focus();
					} else if ($target.is(".controls .color")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						const $move = $controls.find(".move");
						if ($move.length > 0) {
							$move.focus();
						} else {
							$(".open").removeClass("open");
							$controls.find(".ellip").focus();
						}
					} else if ($target.is(".controls .move")) {
						e.preventDefault();
						const $controls = $target.closest(".controls");
						$(".open").removeClass("open");
						$controls.find(".ellip").focus();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 40:
					// down
					if ($target.is(".task .name")) {
						if ($target.length > 0 && Cursor.isCursorOnLastLine($target[0])) {
							e.preventDefault();
							const $task = $target.closest(".task").next();
							if ($task.length > 0) {
								Cursor.setCursorOnFirstLine($task.find(".name")[0]);
							}
						}
					} else if ($target.is(".controls .move")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.addClass("open").find(".move-button").eq(0).focus();
					} else if ($target.is(".controls .move-button")) {
						e.preventDefault();
						$target.next(".move-button").focus();
					} else if ($target.is(".controls .color")) {
						e.preventDefault();
						const $colorButtons = $target.closest(".color-buttons");
						$colorButtons.addClass("open").find(".color-button").eq(0).focus();
					} else if ($target.is(".controls .color-button")) {
						e.preventDefault();
						$target.next(".color-button").focus();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				default:
					// nothing
			}
		});
	});
}
