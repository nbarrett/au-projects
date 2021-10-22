import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Link } from "@mui/material";
import { PRIMARY_LIGHT } from "../../theme/theme";

export function ContactUs() {
    const classes = makeStyles((theme: Theme) => ({
        root: {
            color: "white",
            fontWeight: "bold"
        },
    }))({});
    return (
        <>If you need further assistance, <Link color={PRIMARY_LIGHT} className={classes.root}
                                                href={"mailto:support@auind.co.za?subject=System Access"}>
            Contact us</Link>
        </>);
}
