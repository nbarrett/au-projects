import { WithUid } from "../models/common-models";
import { find, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Company } from "../models/company-models";
import { companyState } from "../atoms/company-atoms";
import { cloneDeep, set } from "lodash";

export default function useSingleCompany() {
    const [document, setDocument] = useRecoilState<WithUid<Company>>(companyState);

    useEffect(() => {
        log.debug("Company change:", document);
    }, [document])


    function saveCompany() {
        save<Company>("companies", document).then((response) => {
            log.debug("response was:", response);
        });
    }

    function findCompany(uid: string): void {
        find<Company>("companies", uid).then((response) => {
            log.debug("response was:", response);
            setDocument(response);
        });
    }


    function changeField(field: string, value: any) {
        log.debug("companyChange:" + document.data.name, "field:", field, "value:", value, "typeof:", typeof value);
        const mutableCompany: WithUid<Company> = cloneDeep(document);
        set(mutableCompany, field, value);
        setDocument(mutableCompany);
    }

    function companyChange(event?: any) {
        const field = event.target.name;
        const value = event.target.value;
        changeField(field, value);
    }

    return {findCompany, saveCompany, document, setDocument, companyChange, changeField};

}
