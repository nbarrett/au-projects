import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { indigo } from "@mui/material/colors";

const TotalProfit = (props) => (
  <Card {...props}>
    <CardContent>
        <Grid container spacing={3} justifyContent={"space-between"}>
            <Grid item>
                <Typography color="textSecondary" gutterBottom variant="h6">
                    TOTAL PROFIT
                </Typography>
                <Typography color="textPrimary" variant="h3">
                    $23,200
                </Typography>
            </Grid>
            <Grid item>
                <Avatar
                    sx={{
                        backgroundColor: indigo[600],
                        height: 56,
                        width: 56,
                    }}
                >
                    <AttachMoneyIcon/>
                </Avatar>
            </Grid>
        </Grid>
    </CardContent>
  </Card>
);

export default TotalProfit;
