import { companiesState } from '../atoms/company-atoms';
import { Company } from '../models/company-models';
import { WithUid } from '../models/common-models';
import { saveAll, subscribe } from '../data-services/firebase-services';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { log } from '../util/logging-config';

export default function useCompanyData() {
    const [companies, setCompanies] = useRecoilState<WithUid<Company>[]>(companiesState);

    useEffect(() => {
        log.info("Companies initial render:", companies);
        const unsub = subscribe<Company>("companies", setCompanies)
        return (() => {
            unsub()
        })
    }, [])

    useEffect(() => {
        log.debug("Companies change:", companies);
    }, [companies])


    function saveAllCompanies() {
        saveAll<Company>("companies", companies).then((response) => {
            log.info("response was:", response)
        });
    }

    return {saveAllCompanies, companies, setCompanies}

}
