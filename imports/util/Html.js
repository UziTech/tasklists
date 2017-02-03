
export function allowIBUtags(html) {
	// for some reason Firefox and Edge put a <br> when nothing is in a new task
	html = html.replace("<br>", "");
	return sanitizeHtml(html, ["i", "em", "b", "strong", "u"]);
}
/**
 * Sanatize html tags
 * @param  {string} html HTML to sanitize
 * @param  {string|string[]} allowedTags The tags to allow in the HTML
 * @return {string} The HTML with the start of unwanted tags changed to &lt;
 */
export function sanitizeHtml(html, allowedTags) {
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
