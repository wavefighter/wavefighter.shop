/**
 * Renders structured data.
 *
 * `dangerouslySetInnerHTML` is unavoidable for a JSON-LD script tag, so the escaping is
 * not optional: `<` becomes its unicode escape, so a `</script>` sequence inside
 * authored content can never break out of the script block.
 *
 * Today every string here is written by us. That is exactly the assumption that stops
 * being true the day content moves into a CMS — and this component will still be here.
 */
export const JsonLd = ({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);
