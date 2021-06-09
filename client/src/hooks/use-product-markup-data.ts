import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { PricingTier } from '../models/product-models';
import { pricingTierState } from '../atoms/product-atoms';
import cloneDeep from 'lodash/cloneDeep';
import { sortBy } from '../util/arrays';

export default function usePricingTierMarkupData(subscribeToUpdates: boolean) {
    const [pricingTiers, setPricingTiers] = useRecoilState<WithUid<PricingTier>[]>(pricingTierState);

    const collection = "pricingTiers";

    useEffect(() => {
        log.info("usePricingTierMarkupData initial render:", pricingTiers);
        if (subscribeToUpdates) {
            const unsub = subscribe<PricingTier>(collection, setPricingTiers)
            return (() => {
                unsub()
            })
        } else {
            refresh()
            return (() => {
            })
        }
    }, [])

    useEffect(() => {
        log.info("usePricingTierMarkupData change:", pricingTiers);
    }, [pricingTiers])

    function saveAllPricingTiers(): Promise<any> {
        return saveAll<PricingTier>(collection, pricingTiers).then(() => {
            if (!subscribeToUpdates) {
                refresh()
            }
        });
    }

    function refresh(): Promise<any> {
        return findAll<PricingTier>(collection).then(response => setPricingTiers(response.sort(sortBy("data.name"))));
    }

    function mutablePricingTiers(): WithUid<PricingTier>[] {
        return cloneDeep(pricingTiers);
    }

    return {refresh, saveAllPricingTiers, mutablePricingTiers, pricingTiers, setPricingTiers}

}
