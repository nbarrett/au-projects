import { useState } from "react";
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
import { fullNameForUser, initialsForUser } from "../../util/strings";
import { AuthenticatedUserData } from "../../models/authentication-models";
import { asDateTime } from "../../util/dates";
import { WithUid } from "../../models/common-models";

export default function UserListResults(props: { userRecords: any[], users: WithUid<AuthenticatedUserData>[], rest?: any[] }) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const handleSelectAll = (event: any) => {
    const newSelectedUserIds = (event.target.checked ? props.users.map((user) => user.uid) : []) as string[];
    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event: any, id: string) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds: any[] | ((prevState: string[]) => string[]) = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(
          selectedUserIds,
          id
      );
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

  const userId = function (user: AuthenticatedUserData) {
    return user.uid || "";
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
                        checked={selectedUserIds.length === props.users.length}
                        color="primary"
                        indeterminate={
                          selectedUserIds.length > 0 &&
                          selectedUserIds.length < props.users.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Registration date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.users.slice(0, limit).map((user) => (
                    <TableRow
                        hover
                        key={user.uid}
                        selected={selectedUserIds.indexOf(userId(user.data)) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedUserIds.indexOf(userId(user.data)) !== -1}
                            onChange={(event) => handleSelectOne(event, userId(user.data))}
                            value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{alignItems: "center", display: "flex",}}>
                          <Avatar src={user.data.avatarUrl} sx={{mr: 2}}>
                            {initialsForUser(user.data)}
                          </Avatar>
                          <Typography color="textPrimary" variant="body1">
                            {fullNameForUser(user.data)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.data.email||"need admin for this"}</TableCell>
                      <TableCell>{user.data.phone}</TableCell>
                      <TableCell>{asDateTime(user.data?.metadata?.creationTime).toFormat("DD/MM/YYYY")}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
            component="div"
            count={props.users.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
  );
}