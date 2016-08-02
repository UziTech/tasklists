import {
	Meteor
} from "meteor/meteor";
import {
	Mongo
} from "meteor/mongo";
import {
	check,
	Match
} from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("tasks", function () {
		return Tasks.find({
			active: true,
			owner: this.userId,
		});
	});
}

Meteor.methods({
	"tasks.insert" (name, start, due, priority, project) {
		check(name, String);
		check(start, Date);
		check(due, Date);
		check(priority, Match.Integer);
		check(project, String);

		// Make sure the user is logged in before inserting a task
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.insert({
			name,
			start,
			due,
			priority,
			project,
			done: false,
			active: true,
			owner: this.userId,
			history: [{
				type: "created",
				time: new Date(),
				user: this.userId,
			}],
		});
	},
	"tasks.delete" (taskId) {
		check(taskId, String);

		Tasks.update(taskId, {
			$set: {
				active: false
			},
			$push: {
				history: {
					type: "deleted",
					time: new Date(),
					user: this.userId,
				}
			}
		});
	},
	"tasks.done" (taskId, done) {
		check(taskId, String);
		check(done, Boolean);

		Tasks.update(taskId, {
			$set: {
				done: done
			},
			$push: {
				history: {
					type: "done",
					value: done,
					time: new Date(),
					user: this.userId,
				}
			}
		});
	},
	"tasks.update" (taskId, start, due) {
		check(taskId, String);
		check(start, Date);
		check(due, Date);

		Tasks.update(taskId, {
			$set: {
				start,
				due
			},
			$push: {
				history: {
					type: "update",
					value: {
						start,
						due
					},
					time: new Date(),
					user: this.userId,
				}
			}
		});
	},
});