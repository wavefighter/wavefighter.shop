import { contact, site } from '@/config/site';

/**
 * Deep links for the two channels that actually produce enquiries in this market.
 *
 * `encodeURIComponent` is not decoration. The product name and URL are interpolated into
 * a URL that opens in the customer's WhatsApp client, and content is authored data.
 * Encoding it is the difference between a link and an injection point — even while every
 * string is still written by us. That assumption stops being true the day content moves
 * into a CMS, and this function will still be here.
 *
 * The message names the product and includes its URL, so whoever picks up the enquiry
 * knows what it is about before they reply. An enquiry that just says "hi" costs two
 * messages to resolve.
 */
export const whatsappLink = (options?: { productName?: string; productPath?: string }): string => {
  const message = options?.productName
    ? `Hello WaveFighter, I'd like a quotation for the ${options.productName}.` +
      (options.productPath ? `\n${site.url}${options.productPath}` : '')
    : `Hello WaveFighter, I'd like to enquire about your products.`;

  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
};

/** `tel:` wants the digits and a leading +, and nothing else. */
export const telLink = (): string => `tel:${contact.phone.replace(/[^\d+]/g, '')}`;
