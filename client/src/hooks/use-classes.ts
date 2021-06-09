import {createStyles, Theme} from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";

export function useClasses() {

    return makeStyles((theme: Theme) =>
        createStyles({
            heading: {
                paddingTop: "15px",
            },
            icon: {
                paddingTop: "15px",
                paddingLeft: "20px",
                fontSize: theme.typography.pxToRem(15),
            },
            detail: {
                padding: 10,
                margins: 0,
            },
            divider: {
                borderLeft: `2px solid ${theme.palette.divider}`,
            },
            muted: {
                paddingLeft: "0px",
                fontSize: theme.typography.pxToRem(12),
                color: theme.palette.text.secondary,
            },
            container: {
                width: "100%",
            },
            columnThird: {
                flexBasis: "33.33%",
            },
            columnTwoThirds: {
                flexBasis: "66.66%",
            },
            rootScrollableMaxHeight: {
                flexGrow: 1,
                maxHeight: 500,
                overflow: "auto"
            },
            overflowScroll: {
                overflow: "scroll;"
            },
            overflowAuto: {
                overflow: "auto;"
            },
            root: {
                flexGrow: 1,
                maxHeight: 500,
                overflow: "auto"
            },
            fullWidth: {
                width: "100%",
            },
            textField: {
                "& > *": {
                    margin: theme.spacing(1),
                    width: "25ch",
                },
            },
            button: {
                marginTop: theme.spacing(0),
                marginRight: theme.spacing(1),
            },
            buttonSuccess: {
                backgroundColor: green[500],
                "&:hover": {
                    backgroundColor: green[700],
                },
            },
            buttonProgress: {
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12,
            },
            paper: {
                padding: theme.spacing(2),
                color: theme.palette.text.secondary,
            },
            wrapper: {
                margin: theme.spacing(1),
                position: "relative",
            },
            rootFlexGrow: {
                flexGrow: 1,
            },
            actionsContainer: {
                marginBottom: theme.spacing(2),
            },
            formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
            resetContainer: {
                padding: theme.spacing(3),
            },
            noSpacing: {
                padding: theme.spacing(0, 0),
            },
            spacingTop: {
                padding: theme.spacing(1, 0, 0, 0),
            },
            instructions: {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1),
            },
            summary: {
                padding: 0,
                height: 25
            },
            fullWidthInput: {
                width: "100%",
            },
            table: {
                minWidth: 650,
            },
            cardContentRoot: {
                alignItems: "flex-start",
            },
            cardContent: {
                padding: theme.spacing(2),
            },
            cardContentItem: {
                padding: theme.spacing(1, 2, 1, 2),
            },
            cardContentDense: {
                padding: theme.spacing(0, 2, 0, 2),
            },
            tagFilterFullWidth: {
                padding: theme.spacing(2, 2, 1, 2),
            },
            narrow: {
                width: "500px",
            },
            sticky: {
                position: "sticky",
                background: "#fff",
                left: 0,
                zIndex: 1,
            },
            short: {
                height: "500px",
            },
        }),
    )();
}
