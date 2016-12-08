import { Template } from "meteor/templating";

import "./bulkEdit.html";
import "./bulkEdit.scss";

Template.bulkEdit.events({
	"click button" () {
		$(document.body).toggleClass("bulk-edit");
	}
});
