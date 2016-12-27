/*
 * inspired by https://github.com/robdodson/Detabinator/
 */

;
(function ($) {
	var focusableElementsSelectors = [
		"a[href]",
		"area[href]",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])",
		"button:not([disabled])",
		"iframe",
		"object",
		"embed",
		"[tabindex]",
		"[contenteditable]"
	];
	var focusableElementsString = focusableElementsSelectors.join(", ");
	$.disableTabindex = function (el, enable, force) {
		var $focusableElements = $(focusableElementsString, el);

		if ($(el).is(focusableElementsString)) {

			// add el to list if it is focusable
			$focusableElements = $focusableElements.add(el);
		}
		$focusableElements.each(function () {
			var $this = $(this);
			var origTabindex = $this.data("origTabindex");
			if (enable) {

				if (typeof origTabindex === "undefined") {
					if (force) {

						// force enable tabindex
						origTabindex = 0;
					} else {

						// don't change anything if there is no origTabindex set
						return;
					}
				}

				// set to origTabindex
				$this.attr({
					tabindex: origTabindex
				});
			} else {

				// TODO: should this default to null if no tabindex and
				//       remove it on enable instead of setting it to 0?
				var currentTabindex = $this.attr("tabindex") || 0;

				if (typeof origTabindex !== "undefined") {

					// origTabindex already exists
					if (force) {

						// force set origTabindex
						$this.data({
							origTabindex: currentTabindex
						});
					}
				} else {

					// set origTabindex
					$this.data({
						origTabindex: currentTabindex
					});
				}

				// disable tabindex
				$this.attr({
					tabindex: -1
				});
			}
		});
	};

	$.fn.disableTabindex = function (enable, force) {
		return this.each(function () {
			$.disableTabindex(this, enable, force);
		});
	};
})(jQuery);
