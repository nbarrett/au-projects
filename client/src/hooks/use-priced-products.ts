import { Company } from "../models/company-models";
import { fullTextSearch } from "../util/strings";
import { PricedProduct, PricingTier } from "../models/product-models";
import useProducts from "./use-products";
import { toPricedProduct } from "../mappings/product-mappings";
import { WithUid } from "../models/common-models";
import { log } from "../util/logging-config";
import { useEffect, useState } from "react";
import usePricingTierMarkupData from "./use-product-markup-data";

export default function UsePricedProducts(company: WithUid<Company>, search?: string) {
  const productData = useProducts();
  const [companyPricingTier, setCompanyPricingTier] = useState<PricingTier>();
  const pricingTierMarkupData = usePricingTierMarkupData(true);

  useEffect(() => {
    if (company) {
      const pricingTier = pricingTierMarkupData.pricingTierForIUid(company?.data?.pricingTier);
      log.debug("company:", company.data.name, "has pricing tier:", pricingTier);
      setCompanyPricingTier(pricingTier);
    }
  }, [company, pricingTierMarkupData.pricingTiers]);

  function documents(): WithUid<PricedProduct>[] {
    const filteredProducts = fullTextSearch(productData.documents, search).filter(item => company.data?.availableProducts?.includes(item.uid));
    const pricedProducts: WithUid<PricedProduct>[] = filteredProducts.map(product => toPricedProduct(product, companyPricingTier));
    log.debug("filtering:", search, "availableProducts:", company?.data?.availableProducts, filteredProducts.length, "of", productData.documents.length, "documents:", pricedProducts);
    return pricedProducts;
  }

  return {documents};

}
