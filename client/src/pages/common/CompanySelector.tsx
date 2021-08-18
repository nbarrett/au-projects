import * as React from "react";
import { useEffect } from "react";
import { ListItemText, MenuItem, TextField, } from "@material-ui/core";
import useCompanyData from "../../hooks/use-company-data";
import { WithUid } from "../../models/common-models";
import { Company } from "../../models/company-models";
import useSingleCompany from "../../hooks/use-single-company";
import { isNewDocument } from "../../mappings/document-mappings";
import { log } from "../../util/logging-config";

export default function CompanySelector() {

  const companyData = useCompanyData()
  const company = useSingleCompany();

  useEffect(() => {
    if (isNewDocument(company.document) && companyData.documents.length > 0) {
      log.debug("companyData", companyData.documents)
      company.setDocument(companyData.documents.find(company => company?.data?.availableProducts?.length > 0))
    }
  }, [companyData.documents])

  return <TextField size={"small"}
                    fullWidth
                    select
                    label="Show prices for"
                    value={company.document?.uid || ""}
                    onChange={(event) => {
                      return company.setDocument(companyData.documents.find(company => company.uid === event.target.value) as WithUid<Company>);
                    }}>
    {companyData.documents.filter(item => item.data.availableProducts?.length > 0).map((option) => (
        <MenuItem key={option.uid} value={option.uid}>
          <ListItemText sx={{display: "inline"}} primary={option.data.name}
                        secondary={`${option.data.availableProducts?.length || 0} available products`}/>
        </MenuItem>
    ))}
  </TextField>
}
