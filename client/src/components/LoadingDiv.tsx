import { CircularProgress } from "@material-ui/core";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/styles";

type LoadingDivProps = {
  fullPage?: boolean;
};

export default function LoadingDiv(props: LoadingDivProps): JSX.Element {
    const classes = makeStyles(() =>
        createStyles({
            root: {
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            fullPage: {
                height: "100vh",
                width: "100vw",
            },
        })
    )();
    return (
        <div className={clsx(classes.root, props.fullPage && classes.fullPage)}>
            <CircularProgress size={48}/>
        </div>
    );
}
