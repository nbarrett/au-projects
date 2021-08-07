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
  const singleCompany = useSingleCompany();

  useEffect(() => {
    if (isNewDocument(singleCompany.company) && companyData.documents.length > 0) {
      log.debug("companyData", companyData.documents)
      singleCompany.setCompany(companyData.documents.find(company => company?.data?.availableProducts?.length > 0))
    }
  }, [companyData.documents])

  return <TextField size={"small"}
                    fullWidth
                    select
                    label="Show prices for"
                    value={singleCompany.company?.uid || ""}
                    onChange={(event) => {
                      return singleCompany.setCompany(companyData.documents.find(company => company.uid === event.target.value) as WithUid<Company>);
                    }}>
    {companyData.documents.map((option) => (
        <MenuItem key={option.uid} value={option.uid}>
          <ListItemText sx={{display: "inline"}} primary={option.data.name}
                        secondary={`${option.data.availableProducts?.length || 0} available products`}/>
        </MenuItem>
    ))}
  </TextField>
}
