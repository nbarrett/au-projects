import { MenuItem } from "../models/menu-models";
import {
    BarChart,
    DollarSign,
    Home,
    Layout,
    Settings,
    ShoppingBag as ShoppingBagIcon,
    ShoppingCart,
    User as UserIcon,
    Users as UsersIcon
} from "react-feather";
import { productRoute } from "../mappings/product-mappings";
import { ProductCodingType } from "../models/product-models";
import { WithUid } from "../models/common-models";
import { UserRoles } from "../models/user-models";
import useUserRoles from "./use-user-roles";
import { AppRoute } from "../models/route-models";

export default function useMenuOptions() {

    const userRoles = useUserRoles();
    const userRolesForId: WithUid<UserRoles> = userRoles.forCurrentUser();

     const HOME: MenuItem[] = [{
         href: AppRoute.HOME,
         icon: Home,
         title: "Home",
     }];

    const ACCOUNT_SETTINGS: MenuItem[] = userRolesForId?.data?.accountSettings ? [{
        href: AppRoute.ACCOUNT_SETTINGS,
        icon: Layout,
        title: "Account Settings",
    }] : [];

    const USER_ADMIN: MenuItem[] = userRolesForId?.data?.userAdmin ? [{
        href: AppRoute.USER_ADMIN,
        icon: UserIcon,
        title: "User Admin"
    }] : [];

    const BACK_OFFICE: MenuItem[] = userRolesForId?.data?.backOffice ? [{
        href: AppRoute.COMPANIES,
        icon: UsersIcon,
        title: "Companies",
    },
        {
            href: AppRoute.PRODUCTS,
            icon: ShoppingBagIcon,
            title: "Products",
            subItems: [
                {
                    href: productRoute(ProductCodingType.CURING_METHOD),
                    title: "Curing Methods",
                },
                {
                    href: productRoute(ProductCodingType.HARDNESS),
                    title: "Hardnesses",
                },
                {
                    href: productRoute(ProductCodingType.COMPOUND),
                    title: "Compounds",
                },
                {
                    href: productRoute(ProductCodingType.TYPE),
                    title: "Types",
                },
                {
                    href: productRoute(ProductCodingType.GRADE),
                    title: "Grades",
                },
                {
                    href: productRoute(ProductCodingType.COLOUR),
                    title: "Colours",
                },
            ]
        },
        {
            href: AppRoute.PRICES,
            icon: DollarSign,
            title: "Prices",
            subItems: [{
                href: AppRoute.PRICING_SETUP,
                icon: Settings,
                title: "Pricing Setup",
            }]
        }, {
            href: AppRoute.EXAMPLE_DASHBOARD,
            icon: BarChart,
            title: "Example Dashboard",
        }] : [];

    const ORDERS: MenuItem[] = userRolesForId?.data?.orders ? [{
        href: AppRoute.ORDERS,
        icon: ShoppingCart,
        title: "Orders",
    }] : [];

    const navItems: MenuItem[] = [
        HOME,
        USER_ADMIN,
        BACK_OFFICE,
        ORDERS,
        ACCOUNT_SETTINGS].flat(2);

    return {
        navItems,
    };

}
