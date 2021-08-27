import { Checkbox, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { WithUid } from "../../models/common-models";
import { Helmet } from "react-helmet";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useSnackbarNotification } from "../../snackbarNotification";
import {
    DataGrid,
    GridColDef,
    GridEditRowsModel,
    GridSelectionModel,
    GridToolbar,
    GridToolbarContainer,
    GridValueGetterParams
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/styles";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";
import { pluraliseWithCount } from "../../util/strings";
import { contentContainer } from "../../admin/components/GlobalStyles";
import useDataGrid from "../../hooks/use-data-grid";
import DeleteManyIcon from "../common/DeleteManyIcon";
import useCompanyData from "../../hooks/use-company-data";
import useUsers from "../../hooks/use-users";
import useUserRoles from "../../hooks/use-user-roles";
import { UserData, UserRoles } from "../../models/user-models";

export function UserAdmin() {
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const notification = useSnackbarNotification();
    const dataGrid = useDataGrid();
    const companyData = useCompanyData();
    const users = useUsers();
    const userRoles = useUserRoles();
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
    const classes = makeStyles(
        {
            root: {
                display: "flex",
                alignItems: "center",
                paddingRight: 16,
            },
            title: {
                fontWeight: "bold",
            },
            tableCell: {
                padding: 15,
                height: window.innerHeight - 120,
                backgroundColor: "white"
            },
        }
    )();

    useEffect(() => {
        log.debug("UserAdmin:initial render");
    }, []);

    useEffect(() => {
        log.debug("selectionModel:", selectionModel);
    }, [selectionModel]);


    function markForDelete() {
        log.debug("marking", selectionModel, "for delete");
        users.setDocuments(users.documents.map(coding => selectionModel.includes(coding.uid) ? {
            ...coding,
            markedForDelete: true
        } : coding));
    }

    const saveOptions =
        <>
            <IconButton onClick={() => {
                users.saveAllUsers()
                    .then(() => userRoles.saveAllUserRoles())
                    .then(() => notification.success(`Saved ${pluraliseWithCount(users.documents.length, "user")}`))
                    .catch((error) => notification.error(`Failed to Save ${pluraliseWithCount(users.documents.length, "user")} due to ${error.toString()}`));
            }}>
                <Tooltip title={`Save all changes`}>
                    <SaveIcon color="primary"/>
                </Tooltip>
            </IconButton>
            <DeleteManyIcon hide singular={"product code"} selectionModel={selectionModel}
                            markForDelete={markForDelete}/>
            <IconButton
                onClick={() => users.refresh()
                    .then(() => userRoles.refresh())
                    .then(() => notification.success(`Any changes were reverted`))}>
                <Tooltip title={`Undo all changes`}>
                    <UndoIcon color="action"/>
                </Tooltip>
            </IconButton>
        </>;

    function CustomToolbar() {
        return (<> <Typography color="textSecondary" variant="h4">User Admin</Typography>
                <GridToolbarContainer>
                    {saveOptions}
                    <GridToolbar/>
                </GridToolbarContainer></>
        );
    }

    function changeField(field: string, value: any, uid: string) {
        log.debug("field", field, "value", value, typeof value, "uid", uid);
        const updatedUser = users.userForUid(uid);
        if (updatedUser) {
            updatedUser.data[field] = value;
            log.debug("updatedUser:", updatedUser);
            users.setDocument(updatedUser);
        } else {
            notification.error(`Cant update user with id: ${uid}, ${field}, ${JSON.stringify(value)}. Try refreshing your browser and try agin`);
        }
    }

    function changeRoleField(field: string, value: any, uid: string) {
        log.debug("field", field, "value", value, typeof value, "uid", uid);
        const updatedUserRoles: WithUid<UserRoles> = userRoles.userRoleForUid(uid);
        if (updatedUserRoles) {
            updatedUserRoles.data[field] = value;
            log.debug("updatedUserRoles:", updatedUserRoles);
            userRoles.setDocument(updatedUserRoles);
        } else {
            notification.error(`Cant update user roles with id: ${uid}, ${field}, ${JSON.stringify(value)}. Try refreshing your browser and try agin`);
        }
    }

    function roleFieldValue(field: string, uid: string) {
        const updatedUserRoles: WithUid<UserRoles> = userRoles.userRoleForUid(uid);
        return updatedUserRoles?.data[field];
    }

    function handleEditRowModelChange(params: GridEditRowsModel) {
        log.debug("handleEditRowModelChange", params);
        map(params, ((editedData, uid) => {
            log.debug("editedData", editedData, "uid", uid);
            map(editedData, ((value, field) => {
                changeField(field, value.value, uid);
            }));
        }));
    }

    const userAdminColumns: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            flex: 2,
            minWidth: 180,
            renderCell: users.NamedAvatarFromGrid,
        },
        {
            field: "company",
            headerName: "Works for",
            flex: 3,
            minWidth: 180,
            renderCell: CompanyRenderer,
        },
        {
            field: "phone",
            headerName: "Phone",
            editable: true,
            flex: 1,
            minWidth: 180,
            type: "string"
        },
        {
            field: "email",
            hide: true,
            headerName: "Email",
            flex: 1,
            minWidth: 180,
            type: "string"
        },
        {
            field: "systemAccess",
            headerName: "System Access",
            flex: 1,
            minWidth: 180,
            renderCell: UserRolesRenderer,
        },
        {
            field: "userAdmin",
            headerName: "User Admin",
            flex: 1,
            minWidth: 180,
            renderCell: UserRolesRenderer,
        },
        {
            field: "backOffice",
            headerName: "Back Office",
            flex: 1,
            minWidth: 180,
            renderCell: UserRolesRenderer,
        },
        {
            field: "orders",
            headerName: "Orders",
            flex: 1,
            minWidth: 180,
            renderCell: UserRolesRenderer,
        },
        {
            field: "accountSettings",
            headerName: "Account Settings",
            flex: 1,
            minWidth: 180,
            renderCell: UserRolesRenderer,
        },
        {
            field: "registered",
            headerName: "Registered",
            flex: 1,
            minWidth: 180,
            type: "string"
        }
    ];

    function UserRolesRenderer(params: GridValueGetterParams): JSX.Element {
        return <UserRoleCheckbox field={params.field} id={params.id as string}/>;
    }

    function UserRoleCheckbox(props: { id: string, field: string }): JSX.Element {
        return <Checkbox checked={roleFieldValue(props.field, props.id)}
                         onChange={(event, value) => changeRoleField(event.target.name, value, props.id)}
                         name={props.field}/>;
    }

    function CompanyRenderer(params: GridValueGetterParams): JSX.Element {
        const user: UserData = params.row as UserData;
        log.debug("CompanyRenderer:user:", user, "user?.data?.companyId", user?.companyId);
        return <TextField
            select
            size={"small"}
            fullWidth
            value={user?.companyId || ""}
            onChange={(event) => changeField("companyId", event.target.value, params.id as string)}>
            {companyData.documents.map((option) => (
                <MenuItem key={option.uid} value={option.uid}>
                    {option.data.name}
                </MenuItem>
            ))}
        </TextField>;
    }

    return <>
        <Helmet>
            <title>User Admin | AU Projects</title>
        </Helmet>
        <Grid sx={contentContainer} container spacing={3}>
            <Grid item xs={12}>
                <DataGrid density={"standard"}
                          className={classes.tableCell}
                          components={{Toolbar: CustomToolbar}}
                          pageSize={itemsPerPage}
                          onCellClick={dataGrid.onCellClick}
                          onSelectionModelChange={(newSelectionModel) => {
                              setSelectionModel(newSelectionModel);
                          }}
                          selectionModel={selectionModel}
                          onPageSizeChange={setItemsPerPage}
                          rowsPerPageOptions={[20]}
                          pagination
                          disableSelectionOnClick
                          onEditRowsModelChange={handleEditRowModelChange}
                          checkboxSelection
                          rows={cloneDeep(users.documents)
                              .filter((item: WithUid<UserData>) => !item.markedForDelete)
                              .map(item => dataGrid.toRow<UserData>(item))}
                          columns={userAdminColumns}/>
            </Grid>
        </Grid>
    </>;

}
