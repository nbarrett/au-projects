import { useState } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Box,
  Card,
  Checkbox, makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Company } from '../../../models/company-models';
import { UserData } from '../../../models/user-models';
import { FirebaseUser } from '../../../models/authentication-models';
import { Theme } from '../../../theme/theme';

export default function CompaniesList(props: { companies: Company[], rest?: any[] }) {
  const useStyles = makeStyles((theme: Theme) => ({
    Media: {
      // height: '10%',
      width: '10px'
    }
  }));
  const classes = useStyles({props});

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const handleSelectAll = (event: any) => {
    const newSelectedCustomerIds = event.target.checked ? props.companies.map((customer) => customer.id) : [];
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event: any, id: string) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds: any[] | ((prevState: string[]) => string[]) = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
          selectedCustomerIds,
          id
      );
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
          selectedCustomerIds.slice(1)
      );
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
          selectedCustomerIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
          selectedCustomerIds.slice(0, selectedIndex),
          selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  function primaryContact(uid: string): UserData {
    return {} as UserData;
  }

  function primaryContactUser(uid: string): FirebaseUser {
    return {} as FirebaseUser;
  }

  return (
      <Card {...props.rest}>
        <PerfectScrollbar>
          <Box sx={{minWidth: 1050}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedCustomerIds.length === props.companies.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0 &&
                          selectedCustomerIds.length < props.companies.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Registration date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.companies.slice(0, limit).map((company) => {
                  const contact: UserData = primaryContact(company.primaryContact);
                  const user: FirebaseUser = primaryContactUser(company.primaryContact);

                  function companyAddress(company: Company): string {
                    return [
                      company?.address?.building,
                      company?.address?.street,
                      company?.address?.suburb,
                      company?.address?.province,
                      company?.address?.postcode,
                      company?.address?.city,
                      company?.address?.country].filter(item => item).join(", ");
                  }

                  return (
                      <TableRow
                          hover
                          key={company.id}
                          selected={selectedCustomerIds.indexOf(company.id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                              checked={selectedCustomerIds.indexOf(company.id) !== -1}
                              onChange={(event) => handleSelectOne(event, company.id)}
                              value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                          >
                            <Avatar sizes={"sm"} src={company.avatarUrl} sx={{mr: 2}}/>
                            <Typography color="textPrimary" variant="body1">
                              {company.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {`${companyAddress(company)}`}
                        </TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          {moment(company.createdAt).format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
            component="div"
            count={props.companies.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
  );
}
