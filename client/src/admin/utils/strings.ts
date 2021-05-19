import { UserData } from '../../models/user-models';

export function initialsForFullName(fullName = ""): string {
    return fullName
        .replace(/\s+/, " ")
        .split(" ")
        .slice(0, 2)
        .map((v) => v && v[0].toUpperCase())
        .join("");
}

export function initialsForUser(user: UserData): string {
    return initialsForFullName(fullNameForUser(user));
}

export function fullNameForUser(user: UserData): string {
    return `${user.firstName} ${user.lastName}`;
}
