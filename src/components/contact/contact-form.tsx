'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/app/contact/actions';
import { Button } from '@/components/primitives/button';
import { cn } from '@/lib/utils/cn';

/**
 * THE CONTACT FORM.
 *
 * A client component, because it needs `useActionState` to show validation errors and a
 * success message without a full page reload. But note what it is NOT: there is no
 * client-side validation library, no react-hook-form, no controlled inputs. The browser
 * handles the typing; the server handles the truth.
 *
 * Because it is a real <form> wrapping a server action, it degrades gracefully: with
 * JavaScript disabled the form still posts and still works. That is not a theoretical concern
 * for a customer standing on a jetty with one bar of signal.
 *
 * The inputs are 52px tall with a visible border that warms to azure on focus. On a form this
 * is where "premium" actually lives — not in the heading above it. A cramped input with a
 * 1px grey outline is what makes a site feel cheap, and it is the single most common place a
 * good design gets abandoned.
 */
const initialState: ContactFormState = { status: 'idle' };

const fieldClasses = (hasError: boolean): string =>
  cn(
    'w-full rounded-md border bg-surface px-4 py-3.5 text-base text-primary',
    'transition-colors duration-[var(--duration-fast)]',
    'placeholder:text-muted',
    hasError ? 'border-error' : 'border-strong hover:border-accent focus:border-accent',
  );

/** Split out so it can call `useFormStatus`, which only reports on the nearest parent form. */
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="accent"
      size="lg"
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? 'Sending…' : 'Send enquiry'}
    </Button>
  );
};

export const ContactForm = ({
  productSlug,
  productName,
}: {
  productSlug?: string | undefined;
  productName?: string | undefined;
}) => {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  if (state.status === 'success') {
    return (
      <div className="waterline rounded-xl border border-default bg-surface-sunken p-10 pt-11">
        <p className="eyebrow mb-4">Received</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Enquiry sent</h2>
        {/* role="status" — announced by a screen reader without stealing focus. Someone who has
            just submitted a form needs to be TOLD it worked; a styled box conveys that to
            sighted users and to nobody else. */}
        <p role="status" className="mt-3 text-base leading-relaxed text-secondary">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-7">
      {/* The product the customer came from, carried invisibly so the enquiry arrives knowing
          what it is about. The visible confirmation below is what tells the CUSTOMER we know. */}
      {productSlug && <input type="hidden" name="product" value={productSlug} />}

      {productName && (
        <p className="flex items-center gap-3 rounded-md border border-brandline bg-accent-subtle px-4 py-3.5 text-sm text-primary">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="size-4 shrink-0 text-accent"
          >
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Enquiring about <span className="font-semibold">{productName}</span>
        </p>
      )}

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="rounded-md border border-error bg-surface px-4 py-3.5 text-sm text-error"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-primary">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? 'name-error' : undefined}
            className={fieldClasses(Boolean(state.errors?.name))}
          />
          {state.errors?.name && (
            <p id="name-error" className="text-sm text-error">
              {state.errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-primary">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? 'email-error' : undefined}
            className={fieldClasses(Boolean(state.errors?.email))}
          />
          {state.errors?.email && (
            <p id="email-error" className="text-sm text-error">
              {state.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-primary">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          /* inputMode="tel" gives a phone keypad on mobile rather than a full keyboard. A small
             thing that removes a small friction, on the field most likely to be abandoned. */
          inputMode="tel"
          className={cn(fieldClasses(false), 'tabular')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-primary">
          What are you looking for?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need. The more detail you give, the more useful our reply will be."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={cn(fieldClasses(Boolean(state.errors?.message)), 'resize-y')}
        />
        {state.errors?.message && (
          <p id="message-error" className="text-sm text-error">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from humans and from assistive technology (aria-hidden + tabIndex -1),
          so only a bot filling every field will touch it. Positioned off-screen rather than
          display:none, because some bots skip hidden inputs — this catches more of them. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  );
};
