// import emailjs from "@emailjs/browser";
// import { siteConfig } from "@/config/site";

// /**
//  * EmailJS Configuration
//  * Set these environment variables in .env.local:
//  * - NEXT_PUBLIC_EMAILJS_SERVICE_ID
//  * - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID (or NEXT_PUBLIC_EMAILJS_CAB_TEMPLATE_ID / NEXT_PUBLIC_EMAILJS_PACKAGE_TEMPLATE_ID)
//  * - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
//  * - NEXT_PUBLIC_EMAILJS_TO_EMAIL (Recipient address where you want to receive booking emails)
//  */
// export const EMAILJS_CONFIG = {
//   serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
//   templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
//   cabTemplateId:
//     process.env.NEXT_PUBLIC_EMAILJS_CAB_TEMPLATE_ID ||
//     process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
//     "",
//   packageTemplateId:
//     process.env.NEXT_PUBLIC_EMAILJS_PACKAGE_TEMPLATE_ID ||
//     process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
//     "",
//   publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
//   toEmail: process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL || siteConfig.email || "info@dgexpresscabs.com",
// };

// export interface CabBookingDetails {
//   vehicle: string;
//   model: string;
//   from: string;
//   to: string;
//   tripType: string;
//   travelDate: string;
//   travelTime?: string;
//   returnDate?: string;
//   returnTime?: string;
//   displayDistance?: string;
//   formattedFare: string;
//   name: string;
//   mobile: string;
//   email?: string;
//   pickup: string;
//   notes?: string;
// }

// export interface PackageBookingDetails {
//   bookingId: string;
//   packageTitle: string;
//   vehicle: string;
//   vehicleModel: string;
//   travelDate: string;
//   price: string;
//   name: string;
//   mobile: string;
//   email?: string;
//   pickupLocation: string;
//   notes?: string;
// }

// export function getEmailJsConfig() {
//   const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || EMAILJS_CONFIG.serviceId;
//   const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || EMAILJS_CONFIG.templateId;
//   const cabTemplateId =
//     process.env.NEXT_PUBLIC_EMAILJS_CAB_TEMPLATE_ID ||
//     templateId ||
//     EMAILJS_CONFIG.cabTemplateId;
//   const packageTemplateId =
//     process.env.NEXT_PUBLIC_EMAILJS_PACKAGE_TEMPLATE_ID ||
//     templateId ||
//     EMAILJS_CONFIG.packageTemplateId;
//   const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || EMAILJS_CONFIG.publicKey;
//   const toEmail = process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL || EMAILJS_CONFIG.toEmail;

//   return { serviceId, templateId, cabTemplateId, packageTemplateId, publicKey, toEmail };
// }

// /**
//  * Generic helper to send an email via EmailJS
//  */
// export async function sendEmail(
//   templateParams: Record<string, unknown>,
//   customTemplateId?: string
// ) {
//   const config = getEmailJsConfig();
//   const serviceId = config.serviceId;
//   const templateId = customTemplateId || config.templateId;
//   const publicKey = config.publicKey;

//   if (!serviceId || !templateId || !publicKey) {
//     console.warn(
//       "[EmailJS] Service ID, Template ID, or Public Key not fully configured in environment variables. Email notification was skipped.",
//       { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey }
//     );
//     return { success: false, skipped: true, reason: "Missing EmailJS credentials in .env.local" };
//   }

//   try {
//     const response = await emailjs.send(
//       serviceId,
//       templateId,
//       templateParams,
//       publicKey
//     );
//     return { success: true, status: response.status, text: response.text };
//   } catch (error) {
//     console.error("[EmailJS] Error sending email:", error);
//     return { success: false, error };
//   }
// }

// /**
//  * Send cab booking notification email
//  */
// export async function sendCabBookingEmail(details: CabBookingDetails) {
//   const config = getEmailJsConfig();
//   const recipientEmail = config.toEmail || "info@dgexpresscabs.com";
//   const customerEmail = details.email?.trim() || "";

//   const returnInfo = details.returnDate
//     ? `\nReturn: ${details.returnDate}${details.returnTime ? ` at ${details.returnTime}` : ""}`
//     : "";

//   const summary = `
// New Cab Booking Request:
// ------------------------------------
// Customer: ${details.name}
// Phone: ${details.mobile}
// Email: ${customerEmail || "Not provided"}
// Pickup Address: ${details.pickup}

// Trip Details:
// Vehicle: ${details.vehicle} (${details.model})
// Route: ${details.from} → ${details.to}
// Trip Type: ${details.tripType}
// Departure: ${details.travelDate}${details.travelTime ? ` at ${details.travelTime}` : ""}${returnInfo}
// Distance: ${details.displayDistance || "N/A"}
// Estimated Fare: ${details.formattedFare}

// Notes: ${details.notes || "None"}
// ------------------------------------
// `.trim();

//   const templateParams: Record<string, unknown> = {
//     // Recipient routing parameters — ensures EmailJS "To Email" field is NEVER empty
//     to_email: recipientEmail,
//     email: recipientEmail,
//     recipient: recipientEmail,
//     recipient_email: recipientEmail,
//     to_name: "D&G Express Cabs",
//     reply_to: customerEmail || recipientEmail,

//     // Customer details
//     customer_email: customerEmail,
//     user_email: customerEmail,
//     name: details.name,
//     customer_name: details.name,
//     user_name: details.name,
//     phone: details.mobile,
//     customer_phone: details.mobile,
//     user_phone: details.mobile,
//     mobile: details.mobile,
//     pickup_address: details.pickup,
//     pickup: details.pickup,
//     notes: details.notes || "",
//     message: summary,

//     // Specific variables
//     form_type: "Cab Booking",
//     vehicle: details.vehicle,
//     model: details.model,
//     vehicle_details: `${details.vehicle} (${details.model})`,
//     from: details.from,
//     to: details.to,
//     route: `${details.from} to ${details.to}`,
//     trip_type: details.tripType,
//     travel_date: details.travelDate,
//     travel_time: details.travelTime || "",
//     return_date: details.returnDate || "",
//     return_time: details.returnTime || "",
//     distance: details.displayDistance || "",
//     fare: details.formattedFare,
//     estimated_fare: details.formattedFare,
//   };

//   return sendEmail(templateParams, config.cabTemplateId);
// }

// /**
//  * Send tour package booking notification email
//  */
// export async function sendPackageBookingEmail(details: PackageBookingDetails) {
//   const config = getEmailJsConfig();
//   const recipientEmail = config.toEmail || "info@dgexpresscabs.com";
//   const customerEmail = details.email?.trim() || "";

//   const summary = `
// New Tour Package Enquiry:
// ------------------------------------
// Enquiry ID: ${details.bookingId}
// Customer: ${details.name}
// Phone: ${details.mobile}
// Email: ${customerEmail || "Not provided"}
// Pickup Location: ${details.pickupLocation}

// Package Details:
// Package: ${details.packageTitle}
// Selected Vehicle: ${details.vehicle} (${details.vehicleModel})
// Travel Date: ${details.travelDate}
// Package Price: ${details.price}

// Notes: ${details.notes || "None"}
// ------------------------------------
// `.trim();

//   const templateParams: Record<string, unknown> = {
//     // Recipient routing parameters — ensures EmailJS "To Email" field is NEVER empty
//     to_email: recipientEmail,
//     email: recipientEmail,
//     recipient: recipientEmail,
//     recipient_email: recipientEmail,
//     to_name: "D&G Express Cabs",
//     reply_to: customerEmail || recipientEmail,

//     // Customer details
//     customer_email: customerEmail,
//     user_email: customerEmail,
//     name: details.name,
//     customer_name: details.name,
//     user_name: details.name,
//     phone: details.mobile,
//     customer_phone: details.mobile,
//     user_phone: details.mobile,
//     mobile: details.mobile,
//     pickup_location: details.pickupLocation,
//     pickup: details.pickupLocation,
//     notes: details.notes || "",
//     message: summary,

//     // Specific variables
//     form_type: "Tour Package Booking",
//     booking_id: details.bookingId,
//     package_title: details.packageTitle,
//     vehicle: details.vehicle,
//     model: details.vehicleModel,
//     vehicle_details: `${details.vehicle} (${details.vehicleModel})`,
//     travel_date: details.travelDate,
//     price: details.price,
//     total_price: details.price,
//   };

//   return sendEmail(templateParams, config.packageTemplateId);
// }

import emailjs from "@emailjs/browser";
import { siteConfig } from "@/config/site";

/**
 * EmailJS Configuration (set in .env.local, then restart `next dev`)
 *
 * NEXT_PUBLIC_EMAILJS_SERVICE_ID
 * NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 * NEXT_PUBLIC_EMAILJS_CAB_TEMPLATE_ID                 -> notification to YOU (cab)
 * NEXT_PUBLIC_EMAILJS_PACKAGE_TEMPLATE_ID             -> notification to YOU (package)
 * NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID            -> thank-you to CUSTOMER (cab)
 * NEXT_PUBLIC_EMAILJS_PACKAGE_CUSTOMER_TEMPLATE_ID    -> thank-you to CUSTOMER (package, optional,
 *                                                        falls back to the cab thank-you template)
 * NEXT_PUBLIC_EMAILJS_TO_EMAIL                        -> where you receive bookings
 * NEXT_PUBLIC_EMAILJS_TEMPLATE_ID                     -> optional generic fallback template
 *
 * In EmailJS, BOTH kinds of template must use:  To Email = {{to_email}}
 */
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  cabTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_CAB_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    "",
  packageTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_PACKAGE_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    "",
  customerTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID || "",
  packageCustomerTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_PACKAGE_CUSTOMER_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID ||
    "",
  toEmail:
    process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL ||
    siteConfig.email ||
    "info@dgexpresscabs.com",
};

export interface CabBookingDetails {
  vehicle: string;
  model: string;
  from: string;
  to: string;
  tripType: string;
  travelDate: string;
  travelTime?: string;
  returnDate?: string;
  returnTime?: string;
  displayDistance?: string;
  formattedFare: string;
  name: string;
  mobile: string;
  email?: string;
  pickup: string;
  notes?: string;
}

export interface PackageBookingDetails {
  bookingId: string;
  packageTitle: string;
  vehicle: string;
  vehicleModel: string;
  travelDate: string;
  price: string;
  name: string;
  mobile: string;
  email?: string;
  pickupLocation: string;
  notes?: string;
}

export function getEmailJsConfig() {
  return { ...EMAILJS_CONFIG };
}

type SendResult = {
  success: boolean;
  skipped?: boolean;
  status?: number;
  text?: string;
  reason?: string;
  error?: unknown;
};

/**
 * Generic helper to send one email via EmailJS.
 * Never throws; always returns a result object.
 */
export async function sendEmail(
  templateParams: Record<string, unknown>,
  customTemplateId?: string
): Promise<SendResult> {
  const { serviceId, publicKey, templateId: defaultTemplateId } = getEmailJsConfig();
  const templateId = customTemplateId || defaultTemplateId;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[EmailJS] Missing credentials. Email skipped.", {
      serviceId: !!serviceId,
      templateId: !!templateId,
      publicKey: !!publicKey,
    });
    return {
      success: false,
      skipped: true,
      reason: "Missing EmailJS credentials in .env.local",
    };
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return { success: true, status: response.status, text: response.text };
  } catch (error) {
    console.error("[EmailJS] Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * Sends the notification to the business and (if the customer gave an email)
 * a thank-you to the customer. A failed thank-you never blocks the notification.
 */
async function sendBookingEmails(opts: {
  params: Record<string, unknown>;
  ownerTemplateId: string;
  customerTemplateId: string;
  ownerEmail: string;
  customerEmail: string;
}) {
  const { params, ownerTemplateId, customerTemplateId, ownerEmail, customerEmail } = opts;

  // 1) Notification to the business: To = owner, Reply-To = customer
  const ownerParams = {
    ...params,
    to_email: ownerEmail,
    email: ownerEmail,
    reply_to: customerEmail || ownerEmail,
  };

  // 2) Thank-you to the customer: To = customer, Reply-To = owner
  const customerParams = {
    ...params,
    to_email: customerEmail,
    email: customerEmail,
    reply_to: ownerEmail,
  };

  const [ownerSettled, customerSettled] = await Promise.allSettled([
    sendEmail(ownerParams, ownerTemplateId),
    customerEmail && customerTemplateId
      ? sendEmail(customerParams, customerTemplateId)
      : Promise.resolve<SendResult>({
          success: true,
          skipped: true,
          reason: customerEmail
            ? "No customer template ID configured"
            : "Customer did not provide an email",
        }),
  ]);

  const owner: SendResult =
    ownerSettled.status === "fulfilled"
      ? ownerSettled.value
      : { success: false, error: ownerSettled.reason };
  const customer: SendResult =
    customerSettled.status === "fulfilled"
      ? customerSettled.value
      : { success: false, error: customerSettled.reason };

  // `success` reflects the notification to you (the one that matters for the booking)
  return { success: owner.success, owner, customer };
}

/**
 * Send cab booking emails (notification + customer thank-you)
 */
export async function sendCabBookingEmail(details: CabBookingDetails) {
  const config = getEmailJsConfig();
  const ownerEmail = config.toEmail || "info@dgexpresscabs.com";
  const customerEmail = details.email?.trim() || "";

  const returnInfo = details.returnDate
    ? `\nReturn: ${details.returnDate}${details.returnTime ? ` at ${details.returnTime}` : ""}`
    : "";

  const summary = `
New Cab Booking Request:
------------------------------------
Customer: ${details.name}
Phone: ${details.mobile}
Email: ${customerEmail || "Not provided"}
Pickup Address: ${details.pickup}

Trip Details:
Vehicle: ${details.vehicle} (${details.model})
Route: ${details.from} → ${details.to}
Trip Type: ${details.tripType}
Departure: ${details.travelDate}${details.travelTime ? ` at ${details.travelTime}` : ""}${returnInfo}
Distance: ${details.displayDistance || "N/A"}
Estimated Fare: ${details.formattedFare}

Notes: ${details.notes || "None"}
------------------------------------
`.trim();

  // to_email, email and reply_to are set per email in sendBookingEmails
  const params: Record<string, unknown> = {
    to_name: "D&G Express Cabs",

    // Customer details
    customer_name: details.name,
    customer_email: customerEmail,
    customer_phone: details.mobile,
    pickup_address: details.pickup,
    notes: details.notes || "",
    message: summary,

    // Booking details
    form_type: "Cab Booking",
    vehicle: details.vehicle,
    model: details.model,
    vehicle_details: `${details.vehicle} (${details.model})`,
    from: details.from,
    to: details.to,
    route: `${details.from} to ${details.to}`,
    trip_type: details.tripType,
    travel_date: details.travelDate,
    travel_time: details.travelTime || "",
    return_date: details.returnDate || "",
    return_time: details.returnTime || "",
    distance: details.displayDistance || "",
    estimated_fare: details.formattedFare,
  };

  return sendBookingEmails({
    params,
    ownerTemplateId: config.cabTemplateId,
    customerTemplateId: config.customerTemplateId,
    ownerEmail,
    customerEmail,
  });
}

/**
 * Send tour package booking emails (notification + customer thank-you)
 */
export async function sendPackageBookingEmail(details: PackageBookingDetails) {
  const config = getEmailJsConfig();
  const ownerEmail = config.toEmail || "info@dgexpresscabs.com";
  const customerEmail = details.email?.trim() || "";

  const summary = `
New Tour Package Enquiry:
------------------------------------
Enquiry ID: ${details.bookingId}
Customer: ${details.name}
Phone: ${details.mobile}
Email: ${customerEmail || "Not provided"}
Pickup Location: ${details.pickupLocation}

Package Details:
Package: ${details.packageTitle}
Selected Vehicle: ${details.vehicle} (${details.vehicleModel})
Travel Date: ${details.travelDate}
Package Price: ${details.price}

Notes: ${details.notes || "None"}
------------------------------------
`.trim();

  const params: Record<string, unknown> = {
    to_name: "D&G Express Cabs",

    // Customer details
    customer_name: details.name,
    customer_email: customerEmail,
    customer_phone: details.mobile,
    pickup_location: details.pickupLocation,
    notes: details.notes || "",
    message: summary,

    // Package details
    form_type: "Tour Package Booking",
    booking_id: details.bookingId,
    package_title: details.packageTitle,
    vehicle: details.vehicle,
    model: details.vehicleModel,
    vehicle_details: `${details.vehicle} (${details.vehicleModel})`,
    travel_date: details.travelDate,
    price: details.price,
  };

  return sendBookingEmails({
    params,
    ownerTemplateId: config.packageTemplateId,
    customerTemplateId: config.packageCustomerTemplateId,
    ownerEmail,
    customerEmail,
  });
}