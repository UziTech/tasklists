export function setCursorAtPoint(x, y) {
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

export function getSelectionRect() {
	const selectionRects = getSelection().getRangeAt(0).getClientRects();
	return selectionRects[selectionRects.length - 1];
}

export function setCursorOnLastLine(node) {
	const nodeRect = node.getBoundingClientRect();
	const selectionRect = getSelectionRect();
	node.focus();
	setCursorAtPoint(selectionRect.left, nodeRect.bottom - 1);
}

export function setCursorOnFirstLine(node) {
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
