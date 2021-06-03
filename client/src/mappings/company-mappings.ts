import { Company } from "../models/company-models";
import { WithUid } from "../models/common-models";

export function companyAddress(company: Company): string {
    return [
        company?.address?.building,
        company?.address?.street,
        company?.address?.suburb,
        company?.address?.province,
        company?.address?.postcode,
        company?.address?.city,
        company?.address?.country].filter(item => item).join(", ");
}

export function companyId(company: WithUid<Company>): string {
    return company.uid || company.data.id || "new";
}
