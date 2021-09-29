import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
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
