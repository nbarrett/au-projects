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
import { EditableTableCell } from "./EditableTableCell";
import { log } from "../../util/logging-config";
import DeleteIcon from "@material-ui/icons/Delete";
import usePricingTierMarkupData from "../../hooks/use-product-markup-data";
import { CellAddress, WithUid } from "../../models/common-models";
import { PricingTier } from "../../models/product-models";
import AddchartIcon from "@material-ui/icons/Addchart";
import { Helmet } from "react-helmet";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { set } from "lodash";
import { asNumber } from "../../util/numbers";
import { useSnackbarNotification } from "../../snackbarNotification";

export function PricingSetup() {
    const pricingTierMarkupData = usePricingTierMarkupData(false);
    const notification = useSnackbarNotification();
    useEffect(() => {
        log.debug("PricingSetup:initial render")
    }, []);

    function markForDelete(uid: string) {
        pricingTierMarkupData.setPricingTiers(pricingTierMarkupData.pricingTiers.map(tier => tier.uid === uid ? {
            ...tier,
            markedForDelete: true
        } : tier))
    }

    function addDocument(index: number) {
        pricingTierMarkupData.setPricingTiers([
            ...pricingTierMarkupData.pricingTiers.slice(0, index),
            {data: {name: "", pricingFactor: 100}, uid: ""},
            ...pricingTierMarkupData.pricingTiers.slice(index)
        ]);
    }

    function onChange(event: any, address: CellAddress) {
        const value = event.target.value;
        const index: number = address.rowIndex;
        const updates: WithUid<PricingTier>[] = pricingTierMarkupData.mutablePricingTiers();
        log.debug("onChange:value", value, typeof value, "address:", address, "updates:", updates);
        set(updates[index], address.field, address.numeric ? asNumber(value) : value);
        pricingTierMarkupData.setPricingTiers(updates)
    }

    return <>
        <Helmet>
            <title>Pricing setup | AU Projects</title>
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
                                        <TableCell align="left">Pricing Tier</TableCell>
                                        <TableCell align="left">Pricing Factor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pricingTierMarkupData.pricingTiers
                                        .filter(item => !item.markedForDelete)
                                        .map((pricingTier, index) => (
                                            <TableRow key={"row-" + index}>
                                                <TableCell padding="checkbox" align="left">
                                                    <Tooltip title={"delete " + pricingTier.data.name}><IconButton
                                                        size="small"
                                                        aria-label="delete pricing tier"
                                                        onClick={() => markForDelete(pricingTier.uid)}>
                                                        <DeleteIcon color="secondary"/>
                                                    </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <EditableTableCell onChange={onChange} key={"name-" + index}
                                                                   value={pricingTier.data.name}
                                                                   address={{
                                                                       field: "data.name",
                                                                       rowIndex: index,
                                                                       numeric: false
                                                                   }}/>
                                                <EditableTableCell inputProps={{
                                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                }} onChange={onChange} key={"pricingFactor-" + index}
                                                                   value={pricingTier.data.pricingFactor}
                                                                   address={{
                                                                       field: "data.pricingFactor",
                                                                       rowIndex: index,
                                                                       numeric: true
                                                                   }}/>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <Grid container spacing={2}>
                                <Grid item xs>
                                    <Tooltip title={"New Pricing Tier"}>
                                        <IconButton onClick={() => addDocument(0)}>
                                            <AddchartIcon color="action"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Save all changes`}>
                                        <IconButton onClick={() => {
                                            pricingTierMarkupData.saveAllPricingTiers().then(() => notification.success(`Saved ${pricingTierMarkupData.pricingTiers.length} pricing tiers`));
                                        }}>
                                            <SaveIcon color="primary"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Undo all changes`}>
                                        <IconButton
                                            onClick={() => pricingTierMarkupData.refresh().then(() => notification.success(`Any changes were reverted`))}>
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
