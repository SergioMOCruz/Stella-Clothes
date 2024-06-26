import { Status } from "../../enum/status";

export interface Order {
  _id,
  userId,
  contactInfo,
  firstName,
  lastName,
  address: {
    street,
    addressContinued,
    city,
    postalCode,
    country,
  },
  paymentId,
  nif,
  status: [
    {
      status: Status,
      date,
    },
  ],
  total,
  createdAt
}
