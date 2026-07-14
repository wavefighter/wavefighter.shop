'use server';

import { z } from 'zod';
import { site } from '@/config/site';

/**
 * The contact form's server action.
 *
 * This is the only place on the site where an untrusted human sends us data, which is why it gets
 * real treatment.
 *
 * Defences, and what each is for:
 *   - Zod validation. Never trust a client: the browser's `required` attribute is a convenience
 *     for the user, not a security control, and it is trivially removed.
 *   - A honeypot field. Hidden from humans, irresistible to naive bots. If it is filled in we
 *     return success and drop the message — telling a bot it failed only teaches it to retry.
 *   - Length caps. An unbounded textarea is an unbounded payload.
 *
 * DELIVERY. The enquiry is sent by email through Resend's REST API — over `fetch`, so there is no
 * new dependency to audit.
 *
 * If RESEND_API_KEY or CONTACT_TO_EMAIL is missing, this returns an ERROR telling the customer to
 * use another channel. It does NOT return success. A form that silently swallows enquiries is the
 * most damaging thing this site could do: the customer believes they have reached you, and waits.
 * (The contact page does not even render the form unless delivery is configured — this is the
 * second line of defence, for the case where the key is removed after deployment.)
 */
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name').max(120),
  email: z.string().trim().email('That does not look like a valid email address').max(200),
  phone: z.string().trim().max(40).optional(),
  /** Set by the product page CTA: /contact?product=<slug> */
  product: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, 'A little more detail will get you a better answer').max(4000),
  /** Honeypot. A human never sees this field, so a human never fills it in. */
  website: z.string().max(0).optional(),
});

/**
 * The fields that can carry a validation error back to the form.
 *
 * Declared as a const tuple with an explicit type guard rather than relying on TypeScript to
 * narrow `issue.path[0]` (which is `string | number | undefined`) through a chain of `===`
 * comparisons. The inference happens to work, but it depends on the exact shape of the
 * validation library's issue type — and that is a dependency's business, not ours. An explicit
 * guard is checked here, in our code, and survives a library upgrade.
 */
const ERROR_FIELDS = ['name', 'email', 'phone', 'message'] as const;
type ErrorField = (typeof ERROR_FIELDS)[number];

const isErrorField = (value: unknown): value is ErrorField =>
  typeof value === 'string' && (ERROR_FIELDS as readonly string[]).includes(value);

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<ErrorField, string>>;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    product: formData.get('product') || undefined,
    message: formData.get('message'),
    website: formData.get('website') || undefined,
  });

  if (!parsed.success) {
    const errors: Partial<Record<ErrorField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (isErrorField(field)) {
        errors[field] ??= issue.message;
      }
    }
    return { status: 'error', message: 'Please check the highlighted fields and try again.', errors };
  }

  // Honeypot tripped: report success, deliver nothing.
  if (parsed.data.website) {
    return { status: 'success', message: 'Thank you — your message has been received.' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!apiKey || !to) {
    // Fail loudly. Never pretend.
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set — enquiry NOT delivered.');
    return {
      status: 'error',
      message:
        'Sorry — the enquiry form is not available right now. Please contact us directly using the details on this page.',
    };
  }

  const { name, email, phone, product, message } = parsed.data;

  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : '',
    product
      ? `<p><strong>Product:</strong> <a href="${site.url}/products/${encodeURIComponent(product)}">${escapeHtml(product)}</a></p>`
      : '',
    `<hr />`,
    `<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
  ]
    .filter(Boolean)
    .join('');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${site.name} website <${from}>`,
        to: [to],
        // So a reply from the inbox goes straight back to the customer.
        reply_to: email,
        subject: product ? `Quotation request: ${product}` : `Website enquiry from ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error('[contact] Resend rejected the request', response.status, await response.text());
      return {
        status: 'error',
        message:
          'Sorry — we could not send your enquiry. Please try again, or contact us directly using the details on this page.',
      };
    }
  } catch (error) {
    console.error('[contact] delivery failed', error);
    return {
      status: 'error',
      message:
        'Sorry — we could not send your enquiry. Please try again, or contact us directly using the details on this page.',
    };
  }

  return { status: 'success', message: 'Thank you — your enquiry has been received.' };
}
