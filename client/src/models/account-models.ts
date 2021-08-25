export enum AccountTab {
    PERSONAL_DETAILS,
    IMAGE,
    SETTINGS,
    CHANGE_PASSWORD,
}

export interface AccountTabDescription {
    [key: number]: string
}

export const AccountTabDescriptions: AccountTabDescription = {
    [AccountTab.PERSONAL_DETAILS]: "Personal Details",
    [AccountTab.IMAGE]: "Upload Image",
    [AccountTab.SETTINGS]: "Settings",
    [AccountTab.CHANGE_PASSWORD]: "Change Password",
};

export function allTabs(): AccountTab[] {
    return [AccountTab.PERSONAL_DETAILS, AccountTab.IMAGE, AccountTab.SETTINGS, AccountTab.CHANGE_PASSWORD];
}
