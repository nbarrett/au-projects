import { Company } from '../../models/company-models';

export const COMPANIES: Company[] = [
  {
    id: "sasol",
    name:"Sasol",
    address: {
      country: "South Africa",
      city: "Johannesburg",
      building: "Sasol Place",
      street: "2849 Fulton Street",
      suburb: "Sandton",
      province: "",
      postcode: "2196"
    },
    primaryContact: "",
    avatarUrl: "/static/images/avatars/sasol.png",
    createdAt: 1555016400000,
  },
  {
    id: "mps",
    name:"Mining Pressure Systems (MPS)",
    address: {
      country: "South Africa",
      city: "Boksburg",
      building: "",
      street: "Cnr Paul Smit and Skew Roads",
      suburb: "Boksburg North",
      province: "Boksburg",
      postcode: "1508"
    },
    website: "https://www.miningpressure.co.za",
    primaryContact: "",
    avatarUrl: "/static/images/avatars/mps.png",
    createdAt: 1555016400000,
  },
];
