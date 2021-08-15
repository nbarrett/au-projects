import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { asDateTime } from "../../util/dates";

const orders = [
  {
    id: uuid(),
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

export function Orders(props) {
  return (
      <Grid container spacing={2} sx={{marginTop: 2, paddingLeft: 0, flexGrow: 1, width: window.innerWidth - 280}}>
        <Grid item xs={12}>
          <Card {...props}>
            <CardHeader title="Latest Orders"/>
            <Divider/>
            <Box sx={{minWidth: 800}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Ref</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          Date
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                      <TableRow hover key={order.id}>
                        <TableCell>{order.ref}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                          {asDateTime(order.createdAt).toFormat("dd-MMM-yyyy")}
                        </TableCell>
                        <TableCell>
                          <Chip color="primary" label={order.status} size="small"/>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
            >
              <Button
                  color="primary"
                  endIcon={<ArrowRightIcon/>}
                  size="small"
                  variant="text"
              >
                View all
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
  )
}
