/**
 * Identity and contact details.
 *
 * NOTHING here is invented. Every contact value comes from an environment variable and
 * defaults to an empty string.
 *
 * This is the mechanism that makes "no fake data" structural rather than a promise: there is
 * no placeholder phone number in the repository to accidentally ship, because there is no
 * phone number in the repository at all. Set them in Vercel → Settings → Environment
 * Variables (or .env.local) and they appear across the site at once.
 *
 * The `has*` flags below are what every component checks before rendering a channel. A
 * WhatsApp button with no number behind it is not a button — it is a dead end that looks
 * like one, and that is worse than an absent button.
 */
export const site = {
  name: 'WaveFighter',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wavefighter.shop',
  tagline: 'Marine equipment and outdoor adventure products',
  description:
    'Marine equipment and outdoor adventure products for boat owners, fishermen, divers, water sports enthusiasts and marine businesses in the United Arab Emirates.',
  locale: 'en_AE',
} as const;

export const contact = {
  /** E.164, digits only, no '+' — the format wa.me expects. e.g. 9715XXXXXXXX */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '',
  email: process.env.NEXT_PUBLIC_EMAIL ?? '',
  address: {
    street: process.env.NEXT_PUBLIC_ADDRESS_STREET ?? '',
    city: process.env.NEXT_PUBLIC_ADDRESS_CITY ?? '',
    country: process.env.NEXT_PUBLIC_ADDRESS_COUNTRY ?? 'AE',
  },
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? '',
} as const;

export const hasWhatsApp = contact.whatsapp.length > 0;
export const hasPhone = contact.phone.length > 0;
export const hasEmail = contact.email.length > 0;
export const hasAddress = contact.address.street.length > 0 && contact.address.city.length > 0;
export const hasHours = contact.hours.length > 0;

/** True when at least one direct channel exists. Used to decide whether the contact page shows
 *  a "faster than a form" column at all. */
export const hasAnyDirectChannel = hasWhatsApp || hasPhone || hasEmail;

/**
 * The contact form is only rendered when delivery is actually configured.
 *
 * A form that silently drops enquiries is the single most damaging thing this site could do:
 * the customer believes they have reached you, and waits. If RESEND_API_KEY and
 * CONTACT_TO_EMAIL are not set, the form does not appear and the direct channels are shown
 * instead. Nothing pretends.
 */
export const hasContactFormDelivery =
  Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.CONTACT_TO_EMAIL);
