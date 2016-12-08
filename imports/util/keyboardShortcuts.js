import { Meteor } from "meteor/meteor";

function setCursorAtPoint(x, y) {
	let range = null;
	if (document.createRange) {
		// Try the standards-based way
		if (document.caretPositionFromPoint) {
			const pos = document.caretPositionFromPoint(x, y);
			range = document.createRange();
			range.setStart(pos.offsetNode, pos.offset);
			range.collapse(true);
		}

		// try the WebKit way
		else if (document.caretRangeFromPoint) {
			range = document.caretRangeFromPoint(x, y);
		}
		const selection = getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}

	// try ie way
	else if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToPoint(x, y);
		range.select();
	}

}

function getSelectionRect() {
	const selectionRects = getSelection().getRangeAt(0).getClientRects();
	return selectionRects[selectionRects.length - 1];
}

function setCursorOnLastLine(node) {
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	node.focus();
	setCursorAtPoint(selectionRect.left, nodeRect.bottom - 1);
}

function setCursorOnFirstLine(node) {
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	node.focus();
	setCursorAtPoint(selectionRect.left, nodeRect.top);
}

function isCursorOnLastLine(node) {
	if (!getSelection().isCollapsed) {
		return false;
	}
	if (!node.hasChildNodes() || node.innerHTML === "") {
		return true;
	}
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	return nodeRect && selectionRect && nodeRect.bottom - 5 === selectionRect.bottom;
}

function isCursorOnFirstLine(node) {
	if (!getSelection().isCollapsed) {
		return false;
	}
	if (!node.hasChildNodes() || node.innerHTML === "") {
		return true;
	}
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	return nodeRect && selectionRect && nodeRect.top + 4 === selectionRect.top;
}

function shouldMoveToDefaultColor($input) {
	const textLength = $input.val().length;
	return ($input[0].selectionStart === textLength && $input[0].selectionEnd === textLength);
}

if (Meteor.isClient) {
	Meteor.startup(function () {
		$(window).on("keydown", function (e) {
			// cannot bind Ctrl(+Shift)?+(n|t|w) https://bugs.chromium.org/p/chromium/issues/detail?id=5496

			// TODO: Ctrl + f: search
			const $target = $(e.target);
			switch (e.which) {
				// case 71:
				// 	// g
				// 	if (e.ctrlKey) {
				// 		e.preventDefault();
				// 		console.log(getSelection());
				// 	}
				// 	break;
				case 112:
					// f1
					e.preventDefault();
					$("#help .help-button").click();
				case 113:
					// f2
					e.preventDefault();
					$("#new-task input").focus().select();
					break;
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
					} else if ($target.is(".controls .default-color")) {
						e.preventDefault();
						$("#new-task input").focus().select();
						getSelection().collapseToEnd();
					} else if ($target.is("#bulk-edit")) {
						e.preventDefault();
						$("#add-task").find(".default-color").focus();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 38:
					// up
					if ($target.is(".task .name")) {
						if ($target.length > 0 && isCursorOnFirstLine($target[0])) {
							e.preventDefault();
							const $task = $target.closest(".task").prev();
							if ($task.length > 0) {
								setCursorOnLastLine($task.find(".name")[0]);
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
					} else if ($target.is("#new-task input")) {
						const textLength = $target.val().length;
						if ($target[0].selectionStart === textLength && $target[0].selectionEnd === textLength) {
							e.preventDefault();
							$("#add-task").find(".default-color").focus();
						}
					} else if ($target.is(".controls .default-color")) {
						e.preventDefault();
						$("#bulk-edit").focus().select();
					} else if ($target.is(".controls button")) {
						e.preventDefault();
					}
					break;
				case 40:
					// down
					if ($target.is(".task .name")) {
						if ($target.length > 0 && isCursorOnLastLine($target[0])) {
							e.preventDefault();
							const $task = $target.closest(".task").next();
							if ($task.length > 0) {
								setCursorOnFirstLine($task.find(".name")[0]);
							}
						}
					} else if ($target.is(".controls .move")) {
						e.preventDefault();
						const $moveButtons = $target.closest(".move-buttons");
						$moveButtons.addClass("open").find(".move-button").eq(0).focus();
					} else if ($target.is(".controls .move-button")) {
						e.preventDefault();
						$target.next(".move-button").focus();
					} else if ($target.is(".controls .color") || $target.is(".controls .default-color")) {
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
