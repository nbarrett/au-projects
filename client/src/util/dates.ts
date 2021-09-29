import { asNumber } from "./numbers";
import { DateTime } from "luxon";
import isNumber from "lodash/isNumber";
import isDate from "lodash/isDate";

export interface DateValue {
    value: number;
    date: Date;
}

export interface Time {
    hours: number;
    minutes: number;
}

export const DateFormats = {
    displayDateAndTime: "DDD h:mm:ss a",
    compactDateAndTime: "DD h:mm:ss a",
    displayDateTh: "MMMM Do YYYY",
    displayDate: "DDD",
    displayDay: "dddd MMMM D, YYYY",
    yyyymmdd: "YYYYMMDD"
};

export function asDate(value): Date {
    return value && asDateTime(value).toJSDate();
}

export function asDateTime(dateValue?: any, inputFormat?: string): DateTime {
    if (!dateValue) {
        return DateTime.now();
    } else if (inputFormat) {
        return DateTime.fromFormat(dateValue, inputFormat);
    } else if (isNumber(dateValue)) {
        return DateTime.fromMillis(dateValue)
    } else if (isDate(dateValue)) {
        return DateTime.fromJSDate(dateValue)
    } else {
        return DateTime.fromISO(dateValue)
    }
}

export function asString(dateValue: any, inputFormat: any, outputFormat: string): string | undefined {
    return dateValue ? asDateTime(dateValue, inputFormat).toFormat(outputFormat) : undefined;
}

export function asValue(dateValue: any, inputFormat?: string) {
    return asDateTime(dateValue, inputFormat).valueOf();
}

export function nowAsValue(): number {
    return asDateTime(undefined, undefined).valueOf();
}

export function displayDateAndTime(dateValue): string | undefined {
    return asString(dateValue, undefined, DateFormats.displayDateAndTime);
}

export function displayDate(dateValue): string | undefined {
    return asString(dateValue, undefined, DateFormats.displayDate);
}

export function displayDay(dateValue): string | undefined {
    return asString(dateValue, undefined, DateFormats.displayDay);
}

export function asDateValue(dateValue?: any, inputFormat?: string): DateValue {
    const dateTime = asDateTime(dateValue, inputFormat);
    return {
        value: dateTime.valueOf(),
        date: dateTime.toJSDate()
    };
}

export function asValueNoTime(dateValue?: any, inputFormat?: string): number {
    return asDateTime(dateValue, inputFormat).startOf("day").valueOf();
}


export function asDateTimeStartOfDay() {
    return asDateTime().startOf("day");
}

export function parseTime(startTime: string): Time {
    const parsedTime = startTime.replace(".", ":");
    const timeValues = parsedTime.split(":");
    let hours = asNumber(timeValues[0]);
    const minutes = asNumber(timeValues[1]);
    if (parsedTime.toLowerCase().includes("pm") && hours < 12) {
        hours += 12;
    }
    return {hours, minutes};
}

export function timeAgo(timestamp: any) {
    if (isNumber(timestamp)) {
        return DateTime.fromMillis(timestamp).toRelative()
    } else {
        return DateTime.fromISO(timestamp).toRelative()
    }
}
