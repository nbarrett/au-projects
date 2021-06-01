import * as React from "react";
import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  IconButton,
  makeStyles,
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
import { Theme } from "../../theme/theme";
import { asDateTime, DateFormats } from "../../util/dates";
import { useRecoilValue } from "recoil";
import { WithUid } from "../../models/common-models";
import { companiesState } from "../../atoms/company-atoms";
import { companyAddress, companyId } from "../../mappings/company-mappings";
import { log } from "../../util/logging-config";
import EditIcon from "@material-ui/icons/Edit";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import useAllUsers from '../../hooks/use-all-users';
import NamedAvatar from '../users/NamedAvatar';

export default function CompaniesList(props: { rest?: any[] }) {
  const useStyles = makeStyles((theme: Theme) => ({
    Media: {
      width: "10px"
    }
  }));
  const classes = useStyles({props});
  const navigate = useNavigate();
  const allUsers = useAllUsers()
  const companies = useRecoilValue<WithUid<Company>[]>(companiesState);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const handleSelectAll = (event: any) => {
    const newSelectedCompanyIds: string[] = event.target.checked ? companies.map((company) => companyId(company)) : [];
    setSelectedCompanyIds(newSelectedCompanyIds);
  };

  const handleSelectOne = (event: any, id: string) => {
    const selectedIndex = selectedCompanyIds.indexOf(id);
    let companyIds: any[] | ((prevState: string[]) => string[]) = [];

    if (selectedIndex === -1) {
      companyIds = companyIds.concat(
          selectedCompanyIds,
          id
      );
    } else if (selectedIndex === 0) {
      companyIds = companyIds.concat(
          selectedCompanyIds.slice(1)
      );
    } else if (selectedIndex === selectedCompanyIds.length - 1) {
      companyIds = companyIds.concat(
          selectedCompanyIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      companyIds = companyIds.concat(
          selectedCompanyIds.slice(0, selectedIndex),
          selectedCompanyIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCompanyIds(companyIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  function primaryContact(uid: string): WithUid<UserData> {
    return allUsers.users.find(user => user.uid === uid) as WithUid<UserData>;
  }

  function primaryContactUser(uid: string): FirebaseUser {
    return {} as FirebaseUser;
  }

  useEffect(() => {
    if (companies) {
      log.info("companies:", companies);
    }
  }, [companies])

  return (
      <Card {...props.rest}>
        <PerfectScrollbar>
          <Box sx={{minWidth: 1050}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedCompanyIds.length === companies.length}
                        color="primary"
                        indeterminate={
                          selectedCompanyIds.length > 0 &&
                          selectedCompanyIds.length < companies.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Primary Contact</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Registration date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.slice(0, limit).map((company) => {
                  log.info("company:", company)
                  const contact: WithUid<UserData> = primaryContact(company.data.primaryContact || "");

                  return (
                      <TableRow
                          hover
                          key={companyId(company)}
                          selected={selectedCompanyIds.indexOf(companyId(company)) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                              checked={selectedCompanyIds.indexOf(companyId(company)) !== -1}
                              onChange={(event) => handleSelectOne(event, companyId(company))}
                              value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Edit ${company.data.name}`}>
                            <IconButton onClick={() => {
                              navigate(`/app/companies/${company.uid}`);
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
          </Box>
        </PerfectScrollbar>
      </Card>
  );
}
