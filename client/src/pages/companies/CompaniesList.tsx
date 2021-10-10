import * as React from "react";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Company } from "../../models/company-models";
import { UserData } from "../../models/user-models";
import { FirebaseUser } from "../../models/authentication-models";
import { asDateTime, DateFormats } from "../../util/dates";
import { useRecoilValue } from "recoil";
import { WithUid } from "../../models/common-models";
import { companiesState } from "../../atoms/company-atoms";
import { companyAddress, companyId } from "../../mappings/company-mappings";
import { log } from "../../util/logging-config";
import EditIcon from "@material-ui/icons/Edit";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import useUsers from "../../hooks/use-users";
import NamedAvatar from "../users/NamedAvatar";
import useSelectedItems from "../../hooks/use-selected-items";
import TableContainer from "@material-ui/core/TableContainer";
import { toAppRoute } from "../../mappings/route-mappings";
import { AppRoute } from "../../models/route-models";
import CheckIcon from "@material-ui/icons/Check";

export default function CompaniesList() {
  const navigate = useNavigate();
  const users = useUsers();
  const companies = useRecoilValue<WithUid<Company>[]>(companiesState);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const selectedItems = useSelectedItems();

  function handleSelectAll(event: any) {
    const newSelectedCompanyIds: string[] = event.target.checked ? companies.map((company) => companyId(company)) : [];
    selectedItems.setItemsSelected(newSelectedCompanyIds);
  }

  function handleLimitChange(event: any) {
    setLimit(event.target.value);
  }

  function handlePageChange(event: any, newPage: number) {
    setPage(newPage);
  }

  function primaryContact(uid: string): WithUid<UserData> {
    return users.documents.find(user => user.uid === uid) as WithUid<UserData>;
  }

  function primaryContactUser(uid: string): FirebaseUser {
    return {} as FirebaseUser;
  }

  useEffect(() => {
    if (companies) {
      log.debug("companies:", companies);
    }
  }, [companies])

  return (
      <Card>
          <Box sx={{minWidth: 1050}}>
            <TableContainer sx={{maxHeight: 800}}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                          checked={selectedItems.itemsSelected.length === companies.length}
                          color="primary"
                          indeterminate={
                            selectedItems.itemsSelected.length > 0 &&
                            selectedItems.itemsSelected.length < companies.length
                          }
                          onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Compound Owner</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Primary Contact</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Registration date</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {companies.slice(0, limit).map((company) => {
                  log.debug("company:", company)
                  const contact: WithUid<UserData> = primaryContact(company.data.primaryContact || "");

                  return (
                      <TableRow
                          hover
                          key={companyId(company)}
                          selected={selectedItems.itemsSelected.includes(companyId(company))}>
                        <TableCell padding="checkbox">
                          <Checkbox
                              checked={selectedItems.itemsSelected.includes(companyId(company))}
                              onChange={(event) => selectedItems.toggleItem(companyId(company))}
                              value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Edit ${company.data.name}`}>
                            <IconButton onClick={() => {
                              navigate(toAppRoute(AppRoute.COMPANIES, company.uid));
                            }}>
                              <EditIcon
                                  color="action"/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}>
                            <Avatar sizes={"sm"} src={company.data.avatarUrl} sx={{mr: 2}}/>
                            <Typography color="textPrimary" variant="body1">
                              {company.data.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {company.data.code}
                        </TableCell>
                        <TableCell>
                          {company.data.compoundOwner ? <IconButton>
                            <CheckIcon color="action"/>
                          </IconButton> : null}
                        </TableCell>
                        <TableCell>
                          {`${companyAddress(company.data)}`}
                        </TableCell>
                        <TableCell>
                          <NamedAvatar user={contact?.data}/>
                        </TableCell>
                        <TableCell>{contact?.data?.phone}</TableCell>
                        <TableCell>
                          {asDateTime(company.data.createdAt).toFormat(DateFormats.displayDateAndTime)}
                        </TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Grid container spacing={2}>
              <Grid item xs>
                <Tooltip title={"New Company"}>
                  <IconButton onClick={() => {
                    navigate(`/app/companies/new`);
                  }}>
                    <GroupAddIcon fontSize="large"
                                  color="action"/>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <TablePagination
                    component="div"
                    count={companies.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25]}
                />
              </Grid>
            </Grid>
            </TableContainer>
          </Box>
      </Card>
  );
}
