export function setCursorAtPoint(x, y) {
	let range = null;
	if (document.createRange) {
		// Try the Firefox way
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
		if (range) {
			selection.addRange(range);
		}
	}

	// try ie way
	else if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToPoint(x, y);
		range.select();
	}

}

export function getSelectionRect() {
	const selection = getSelection();
	if (selection.rangeCount > 0) {
		const selectionRects = selection.getRangeAt(0).getClientRects();
		return selectionRects[selectionRects.length - 1];
	}
	return null;
}

export function scrollIntoViewIfNeeded(node) {
	if (node.scrollIntoViewIfNeeded) {
		// try webkit way
		node.scrollIntoViewIfNeeded(false);
	} else {
		// modified from http://stackoverflow.com/a/34003331/806777
		function withinBounds(value, min, max) {
			return Math.min(max, Math.max(min, value));
		}

		function makeArea(left, top, width, height) {
			return {
				"left": left,
				"top": top,
				"width": width,
				"height": height,
				"right": left + width,
				"bottom": top + height,
				"translate": function (x, y) {
					return makeArea(x + left, y + top, width, height);
				},
				"relativeFromTo": function (lhs, rhs) {
					var newLeft = left,
						newTop = top;
					lhs = lhs.offsetParent;
					rhs = rhs.offsetParent;
					if (lhs === rhs) {
						return area;
					}
					for (; lhs; lhs = lhs.offsetParent) {
						newLeft += lhs.offsetLeft + lhs.clientLeft;
						newTop += lhs.offsetTop + lhs.clientTop;
					}
					for (; rhs; rhs = rhs.offsetParent) {
						newLeft -= rhs.offsetLeft + rhs.clientLeft;
						newTop -= rhs.offsetTop + rhs.clientTop;
					}
					return makeArea(newLeft, newTop, width, height);
				}
			};
		}

		var parent, elem = node,
			area = makeArea(
				node.offsetLeft, node.offsetTop,
				node.offsetWidth, node.offsetHeight);
		while ((parent = elem.parentNode) instanceof HTMLElement) {
			var clientLeft = parent.offsetLeft + parent.clientLeft;
			var clientTop = parent.offsetTop + parent.clientTop;

			// Make area relative to parent's client area.
			area = area.
			relativeFromTo(elem, parent).
			translate(-clientLeft, -clientTop);

			parent.scrollLeft = withinBounds(
				parent.scrollLeft,
				area.right - parent.clientWidth, area.left,
				parent.clientWidth);

			parent.scrollTop = withinBounds(
				parent.scrollTop,
				area.bottom - parent.clientHeight, area.top,
				parent.clientHeight);

			// Determine actual scroll amount by reading back scroll properties.
			area = area.translate(clientLeft - parent.scrollLeft,
				clientTop - parent.scrollTop);
			elem = parent;
		}
	};
}

export function setCursorOnLastLine(node) {
	scrollIntoViewIfNeeded(node.closest(".task"));
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	node.focus();
	setCursorAtPoint(selectionRect.left, nodeRect.bottom - 1);
}

export function setCursorOnFirstLine(node) {
	scrollIntoViewIfNeeded(node.closest(".task"));
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	node.focus();
	setCursorAtPoint(selectionRect.left, nodeRect.top);
}

export function isCursorOnLastLine(node) {
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

export function isCursorOnFirstLine(node) {
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
