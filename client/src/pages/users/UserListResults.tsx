import * as React from "react";
import { useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { asDateTime, DateFormats } from "../../util/dates";
import { WithUid } from "../../models/common-models";
import SaveIcon from "@material-ui/icons/Save";
import useCompanyData from "../../hooks/use-company-data";
import { log } from "../../util/logging-config";
import { UserData } from "../../models/user-models";
import { cloneDeep } from "lodash";
import useAllUsers from "../../hooks/use-all-users";
import NamedAvatar from "./NamedAvatar";

export default function UserListResults(props: { userRecords: any[], rest?: any[] }) {
  const companyData = useCompanyData();
  const allUsers = useAllUsers()
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const handleSelectAll = (event: any) => {
    const newSelectedUserIds = (event.target.checked ? allUsers.users.map((user) => user.uid) : []) as string[];
    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event: any, id: string) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds: any[] | ((prevState: string[]) => string[]) = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds).concat(id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
          selectedUserIds.slice(1)
      );
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(
          selectedUserIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
          selectedUserIds.slice(0, selectedIndex),
          selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const userId = function (user: WithUid<UserData>) {
    return user.uid || "";
  };

  function handleChange(event?: any, value?: any): any {
    log.debug("value:", value)
  }

  function userChange(event: any, user: WithUid<UserData>) {
    const value = event.target.value;
    const mutableUser: WithUid<UserData> = cloneDeep(user);
    mutableUser.data.companyId = value;
    log.debug("userChange:" + value, "mutableUser:", mutableUser);
    allUsers.setOne(mutableUser)
  }

  return (
      <Card {...props.rest}>
          <Box sx={{minWidth: 1050}}>
            <Table size={"small"}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedUserIds.length === allUsers.users.length}
                        color="primary"
                        indeterminate={
                          selectedUserIds.length > 0 &&
                          selectedUserIds.length < allUsers.users.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUsers.users.slice(0, limit).map((user) => (
                    <TableRow
                        hover
                        key={user.uid}
                        selected={selectedUserIds.indexOf(userId(user)) !== -1}>
                      <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedUserIds.indexOf(userId(user)) !== -1}
                            onChange={(event) => handleSelectOne(event, userId(user))}
                            value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <NamedAvatar user={user.data}/>
                      </TableCell>
                      <TableCell>
                        <div>
                          <TextField
                              select
                              fullWidth
                              label="Works for"
                              value={user.data.companyId || ""}
                              onChange={(event) => userChange(event, user)}>
                            {companyData.documents.map((option) => (
                                <MenuItem key={option.uid} value={option.uid}>
                                  {option.data.name}
                                </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </TableCell>
                      <TableCell>{user.data.phone}</TableCell>
                      <TableCell>{"need admin for this"}</TableCell>
                      <TableCell>{asDateTime().toFormat(DateFormats.displayDateAndTime)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        <Grid spacing={2}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center">
          <Grid item xs>
            <Tooltip title={"Save all user changes"}>
              <IconButton onClick={() => {
                allUsers.saveAllUsers();
              }}>
                <SaveIcon color="primary"/>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TablePagination
                component="div"
                count={allUsers.users.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
          </Grid>
        </Grid>
      </Card>
  );
}
