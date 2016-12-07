import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check, Match } from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
	Meteor.publish("tasks", function () {
		return Tasks.find({
			deletedAt: false,
			owner: this.userId,
		});
	});
} else if (Meteor.isClient) {
	Meteor.subscribe("tasks");
}

Meteor.methods({
	"tasks.insert" (name, start, due, priority, project, color) {
		check(name, String);
		check(start, Date);
		check(due, Date);
		check(priority, Match.Integer);
		check(project, String);
		check(color, String);

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
			color,
			doneAt: false,
			deletedAt: false,
			createdAt: new Date(),
			owner: this.userId,
			history: [],
		});
	},
	"tasks.delete" (taskId) {
		check(taskId, String);

		Tasks.update(taskId, {
			$set: {
				deletedAt: new Date()
			}
		});
	},
	"tasks.done" (taskId, done) {
		check(taskId, String);
		check(done, Boolean);

		const doneAt = (done ? new Date() : false);

		Tasks.update(taskId, {
			$set: {
				doneAt
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
	"tasks.move" (taskId, start, due) {
		check(taskId, String);
		check(start, Date);
		check(due, Date);

		var task = Tasks.findOne(taskId);

		if (task.start.getTime() !== start.getTime() || task.due.getTime() !== due.getTime()) {
			Tasks.update(taskId, {
				$set: {
					doneAt: false,
					start,
					due
				},
				$push: {
					history: {
						type: "move",
						value: {
							start,
							due
						},
						time: new Date(),
						user: this.userId,
					}
				}
			});
		}
	},
	"tasks.edit" (taskId, name, lastClientId) {
		check(taskId, String);
		check(name, String);
		check(lastClientId, String);

		var task = Tasks.findOne(taskId);

		if (task && task.name !== name) {
			Tasks.update(taskId, {
				$set: {
					name,
					lastClientId
				},
				$push: {
					history: {
						type: "edit",
						value: {
							name
						},
						time: new Date(),
						user: this.userId,
					}
				}
			});
		}
	},
	"tasks.color" (taskId, color) {
		check(taskId, String);
		check(color, String);

		var task = Tasks.findOne(taskId);

		if (task.color !== color) {
			Tasks.update(taskId, {
				$set: {
					color
				},
				$push: {
					history: {
						type: "color",
						value: {
							color
						},
						time: new Date(),
						user: this.userId,
					}
				}
			});
		}
	},
});
