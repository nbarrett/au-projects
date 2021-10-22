import { companiesState } from "../atoms/company-atoms";
import { Company } from "../models/company-models";
import { WithUid } from "../models/common-models";
import { saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";

export default function useCompanyData(): CompanyData {
    const [documents, setDocuments] = useRecoilState<WithUid<Company>[]>(companiesState);
    const collection = "companies";
    useEffect(() => {
        log.debug("Companies initial render:", documents);
        const unsub = subscribe<Company>(collection, setDocuments);
        return (() => {
            log.debug("unsub");
            unsub();
        });
    }, []);

    useEffect(() => {
        log.debug("Companies change:", documents);
    }, [documents])


    function saveAllCompanies() {
        saveAll<Company>(collection, documents).then((response) => {
            log.debug("response was:", response)
        });
    }

    function companyForUid(uid: string): WithUid<Company> {
        return documents?.find(company => company?.uid === uid);
    }

    return {
        saveAllCompanies,
        companyForUid,
        documents,
        setDocuments
    };

}

export interface CompanyData {
    saveAllCompanies: () => void;
    companyForUid: (uid: string) => WithUid<Company>;
    documents: WithUid<Company>[];
    setDocuments: (valOrUpdater: (((currVal: WithUid<Company>[]) => WithUid<Company>[]) | WithUid<Company>[])) => void;
}

