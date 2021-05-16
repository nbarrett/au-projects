import { useState } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import getInitials from "../../utils/getInitials";
import { Customer } from '../../../models/product-models';

export default function CustomerListResults(props: { customers: Customer[], rest?: any[] }) {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const handleSelectAll = (event: any) => {
    const newSelectedCustomerIds = event.target.checked ? props.customers.map((customer) => customer.id) : [];
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

  return (
      <Card {...props.rest}>
        <PerfectScrollbar>
          <Box sx={{minWidth: 1050}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedCustomerIds.length === props.customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0 &&
                          selectedCustomerIds.length < props.customers.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Registration date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.customers.slice(0, limit).map((customer) => (
                    <TableRow
                        hover
                        key={customer.id}
                        selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                            onChange={(event) => handleSelectOne(event, customer.id)}
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
                          <Avatar src={customer.avatarUrl} sx={{mr: 2}}>
                            {getInitials(customer.name)}
                          </Avatar>
                          <Typography color="textPrimary" variant="body1">
                            {customer.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {moment(customer.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
            component="div"
            count={props.customers.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
  );
}
