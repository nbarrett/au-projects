import { WithUid } from "../models/common-models";
import { find, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Company } from "../models/company-models";
import { companyState } from "../atoms/company-atoms";
import { cloneDeep, set } from "lodash";

export default function useSingleCompany() {
    const [company, setCompany] = useRecoilState<WithUid<Company>>(companyState);

    useEffect(() => {
        log.debug("Company change:", company);
    }, [company])


    function saveCompany() {
        save<Company>("companies", company).then((response) => {
            log.info("response was:", response)
        });
    }

    function findCompany(uid: string): void {
        find<Company>("companies", uid).then((response) => {
            log.info("response was:", response)
            setCompany(response)
        });
    }


    function changeField(field: string, value: any) {
        log.info("companyChange:" + company.data.name, "field:", field, "value:", value, "typeof:", typeof value);
        const mutableCompany: WithUid<Company> = cloneDeep(company);
        set(mutableCompany, field, value)
        setCompany(mutableCompany);
    }

    function companyChange(event?: any) {
        const field = event.target.name;
        const value = event.target.value;
        changeField(field, value);
    }

    return {findCompany, saveCompany, company, setCompany, companyChange, changeField}

}
