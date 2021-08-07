import { FunctionComponent } from "react";
import { Props } from "react-feather";

export interface MenuItem {
    href: string;
    icon?: FunctionComponent<Props>;
    title: string;
    subItems?: MenuItem[]
}
