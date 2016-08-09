import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "../imports/templates/addTask/addTask";
import "../imports/templates/lists/list";
import "../imports/util/keyboardShortcuts";

// add a11y attributes to login buttons
function addA11y() {
	$("#login-buttons .login-button").each(function () {
		const $this = $(this);
		$this.attr({
			tabindex: 0,
			role: "button",
			title: $this.text()
		}).keydown(function (e) {

			// simulate click on enter or spacebar
			if ([13, 32].includes(e.which)) {
				e.preventDefault();
				$(this).click();
			}
		});
	});
}

Template._loginButtonsLoggedOutSingleLoginButton.onRendered(addA11y);
Template._loginButtonsLoggedInSingleLogoutButton.onRendered(addA11y);
// might need these later
// Template._resetPasswordDialog.onRendered(addA11y);
// Template._justResetPasswordDialog.onRendered(addA11y);
// Template._enrollAccountDialog.onRendered(addA11y);
// Template._justVerifiedEmailDialog.onRendered(addA11y);
// Template._loginButtonsMessagesDialog.onRendered(addA11y);
// Template._configureLoginOnDesktopDialog.onRendered(addA11y);
// Template._loginButtonsLoggedInDropdownActions.onRendered(addA11y);
// Template._loginButtonsLoggedOutPasswordService.onRendered(addA11y);
// Template._forgotPasswordForm.onRendered(addA11y);
// Template._loginButtonsFormField.onRendered(addA11y);

Template.body.events({
	"focus, click" (e) {

		// close any open controls on focusing/clicking something else
		if (!e.target.closest(".controls")) {
			$(".open").removeClass("open");
		}
	},
});
