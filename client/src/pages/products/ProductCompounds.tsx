import {
    Box,
    Card,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@material-ui/core";
import React, { useEffect } from "react";
import { log } from "../../util/logging-config";
import DeleteIcon from '@material-ui/icons/Delete';
import { CellAddress, WithUid } from "../../models/common-models";
import { ProductCompound } from "../../models/product-models";
import AddchartIcon from "@material-ui/icons/Addchart";
import { Helmet } from 'react-helmet';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import { set } from "lodash";
import { asNumber } from '../../util/numbers';
import { useSnackbarNotification } from '../../snackbarNotification';
import useProductCompoundData from '../../hooks/use-product-compound-data';
import { EditableTableCell } from '../price-setup/EditableTableCell';

export function ProductCompounds() {
    const notification = useSnackbarNotification();
    const productCompoundData = useProductCompoundData(false);
    useEffect(() => {
        log.info("ProductCompounds:initial render")
    }, []);

    function markForDelete(uid: string) {
        productCompoundData.setProductCompounds(productCompoundData.productCompounds.map(tier => tier.uid === uid ? {
            ...tier,
            markedForDelete: true
        } : tier))
    }

    function addDocument(index: number) {
        productCompoundData.setProductCompounds([
            ...productCompoundData.productCompounds.slice(0, index),
            {data: {code: "", name: ""}, uid: ""},
            ...productCompoundData.productCompounds.slice(index)
        ]);
    }

    function onChange(event: any, address: CellAddress) {
        const value = event.target.value;
        const index: number = address.rowIndex;
        const updates: WithUid<ProductCompound>[] = productCompoundData.mutableProductCompounds();
        log.info("onChange:value", value, typeof value, "address:", address, "updates:", updates);
        set(updates[index], address.field, address.numeric ? asNumber(value) : value);
        productCompoundData.setProductCompounds(updates)
    }

    return <>
        <Helmet>
            <title>Product Compounds | AU Projects</title>
        </Helmet>
        <Box
            sx={{
                backgroundColor: "background.default",
                minHeight: "100%",
                py: 3,
            }}>
            <Container maxWidth={false}>
                <Box sx={{pt: 3}}>
                    <Card>
                        <TableContainer sx={{maxHeight: 800}}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Actions</TableCell>
                                        <TableCell align="left">Code</TableCell>
                                        <TableCell align="left">Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productCompoundData.productCompounds
                                        .filter(item => !item.markedForDelete)
                                        .map((productCompound, index) => (
                                            <TableRow key={"row-" + index}>
                                                <TableCell padding="checkbox" align="left">
                                                    <Tooltip title={"delete " + productCompound.data.code}><IconButton
                                                        size="small"
                                                        aria-label="delete product compound"
                                                        onClick={() => markForDelete(productCompound.uid)}>
                                                        <DeleteIcon color="secondary"/>
                                                    </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <EditableTableCell onChange={onChange} key={"code-" + index}
                                                                   value={productCompound.data.code}
                                                                   address={{
                                                                       field: "data.code",
                                                                       rowIndex: index
                                                                   }}/>
                                                <EditableTableCell onChange={onChange} key={"name-" + index}
                                                                   value={productCompound.data.name}
                                                                   address={{
                                                                       field: "data.name",
                                                                       rowIndex: index
                                                                   }}/>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <Grid container spacing={2}>
                                <Grid item xs>
                                    <Tooltip title={"New Product Compound"}>
                                        <IconButton onClick={() => addDocument(0)}>
                                            <AddchartIcon color="action"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Save all changes`}>
                                        <IconButton onClick={() => {
                                            productCompoundData.saveAllProductCompounds().then(() => notification.success(`Saved ${productCompoundData.productCompounds.length} product compounds`));
                                        }}>
                                            <SaveIcon color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Undo all changes`}>
                                        <IconButton
                                            onClick={() => productCompoundData.refresh().then(() => notification.success(`Any changes were reverted`))}>
                                            <UndoIcon
                                                color="action"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </TableContainer>
                    </Card>
                </Box>
            </Container>
        </Box>
    </>

}
