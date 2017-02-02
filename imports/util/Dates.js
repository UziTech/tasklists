export function getDay(date) {
	date = date || new Date();

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return new Date(year, month, day);
}

export function getDateFromList(list) {
	switch (list) {
		case "today":
			return today();
		case "tomorrow":
			return tomorrow();
		case "thisweek":
			return thisWeek() || tomorrow();
		case "nextweek":
			return nextWeek();
		case "thismonth":
			return thisMonth() || nextWeek();
		case "nextmonth":
			return nextMonth();
		case "later":
			return later();
		default:
			// do nothing
	}
}

export function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);

	return d;
}

export function daysDiff(date1, date2) {
	const d1 = getDay(date1);
	const d2 = getDay(date2);

	return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}

export function lastDayOfMonth(date) {
	date = date || new Date();

	const month = date.getMonth();
	const year = date.getFullYear();

	return (new Date(year, month + 1, 0)).getDate();
}

export function today(date) {
	return getDay(date);
}

export function tomorrow(date) {
	return addDays(getDay(date), 1);
}

export function thisWeek(date) {
	// thisWeek ends on Sunday
	date = getDay(date);
	if (date.getDay() === 0 || date.getDay() === 6) {
		// thisWeek is done after today or tomorrow
		// so no tasks will be in thisWeek that are not in today or tomorrow
		return false;
	}
	return addDays(date, 2);
}

export function nextWeek(date) {
	// nextWeek begins on Monday
	date = getDay(date);

	// get days until next monday
	let days = ((7 - date.getDay()) % 7) + 1;

	if (days === 1) {
		// skip tomorrows tasks
		days = 2;
	}

	return addDays(date, days);
}

export function thisMonth(date) {
	date = getDay(date);
	const lastDate = lastDayOfMonth();
	const daysUntilMondayAfterNext = ((7 - date.getDay()) % 7) + 8;
	if (date.getDate() + daysUntilMondayAfterNext > lastDate) {
		// thisMonth is done after today or tomorrow or nextWeek
		// so no tasks will be in thisMonth that are not in today
		// or tomorrow or nextWeek
		return false;
	}
	return addDays(date, daysUntilMondayAfterNext);
}

export function nextMonth(date) {
	date = getDay(date);

	const daysUntilMondayAfterNext = ((7 - date.getDay()) % 7) + 8;
	const afterNextWeekDate = addDays(date, daysUntilMondayAfterNext);

	const month = date.getMonth();
	const year = date.getFullYear();
	const nextMonthDate = new Date(year, month + 1, 1);

	return (afterNextWeekDate > nextMonthDate ? afterNextWeekDate : nextMonthDate);
}

export function later(date) {
	date = getDay(date);

	const month = date.getMonth();
	const year = date.getFullYear();

	return new Date(year, month + 2, 1);
}

// export function test(date) {
// 	date = getDay(date);
// 	for (let i = 0; i < 31; i++) {
// 		const d = addDays(date, i);
// 		console.log("Date:", d);
// 		console.log("Today:", today(d));
// 		console.log("Tomorrow:", tomorrow(d));
// 		console.log("This Week:", thisWeek(d));
// 		console.log("Next Week:", nextWeek(d));
// 		console.log("This Month:", thisMonth(d));
// 		console.log("Next Month:", nextMonth(d));
// 		console.log("Later:", later(d));
// 		console.log("");
// 	}
// }
