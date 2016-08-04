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
	Meteor.publish("tasks", function () {
		return Tasks.find({
			active: true,
			owner: this.userId,
		});
	});
} else if (Meteor.isClient) {
	Meteor.subscribe("tasks");
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
	"tasks.move" (taskId, start, due) {
		check(taskId, String);
		check(start, Date);
		check(due, Date);

		var task = Tasks.findOne(taskId);

		if (task.start.getTime() !== start.getTime() || task.due.getTime() !== due.getTime()) {
			Tasks.update(taskId, {
				$set: {
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
	"tasks.edit" (taskId, name) {
		check(taskId, String);
		check(name, String);

		var task = Tasks.findOne(taskId);

		if (task.name !== name) {
			Tasks.update(taskId, {
				$set: {
					name
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
});
