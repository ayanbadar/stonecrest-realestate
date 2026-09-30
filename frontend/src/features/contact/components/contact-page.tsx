import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextButton } from "@/components/brand/text-link";
import { Reveal } from "@/components/motion/reveal";
import { useCreateInquiry } from "@/features/inquiries/api/inquiries.api";

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please share a little more detail"),
  property_slug: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const fieldClass =
  "mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground";

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const propertySlug = searchParams.get("property") ?? "";
  const mutation = useCreateInquiry();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: propertySlug
        ? `I would like to enquire about the residence: ${propertySlug}`
        : "",
      property_slug: propertySlug,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      phone: values.phone || "",
      property_slug: values.property_slug || undefined,
    });
    form.reset({
      name: "",
      email: "",
      phone: "",
      message: "",
      property_slug: "",
    });
  });

  return (
    <div className="pt-[4.5rem] lg:pt-20">
      <section className="container-editorial section-y">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <p className="label-caps text-muted-foreground">Contact</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Arrange a private consultation.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Share a brief note and we will respond with discretion — whether
              you are acquiring, releasing, or seeking counsel on a development.
            </p>
            <address className="mt-12 space-y-2 text-sm not-italic text-muted-foreground">
              <p>Dubai, United Arab Emirates</p>
              <a
                href="mailto:hello@stonecrestdxb.com"
                className="block transition-opacity hover:opacity-70"
              >
                hello@stonecrestdxb.com
              </a>
              <a
                href="tel:+971400000000"
                className="block transition-opacity hover:opacity-70"
              >
                +971 4 000 0000
              </a>
            </address>
          </Reveal>

          <Reveal>
            <form onSubmit={onSubmit} className="space-y-8" noValidate>
              <label className="block">
                <span className="label-caps text-muted-foreground">Name</span>
                <input
                  className={fieldClass}
                  {...form.register("name")}
                  autoComplete="name"
                />
                {form.formState.errors.name ? (
                  <p className="mt-2 text-xs text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">Email</span>
                <input
                  type="email"
                  className={fieldClass}
                  {...form.register("email")}
                  autoComplete="email"
                />
                {form.formState.errors.email ? (
                  <p className="mt-2 text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">Phone</span>
                <input
                  type="tel"
                  className={fieldClass}
                  {...form.register("phone")}
                  autoComplete="tel"
                />
              </label>

              <label className="block">
                <span className="label-caps text-muted-foreground">Message</span>
                <textarea
                  rows={5}
                  className={`${fieldClass} resize-none`}
                  {...form.register("message")}
                />
                {form.formState.errors.message ? (
                  <p className="mt-2 text-xs text-destructive">
                    {form.formState.errors.message.message}
                  </p>
                ) : null}
              </label>

              <input type="hidden" {...form.register("property_slug")} />

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <TextButton
                  type="submit"
                  tone="dark"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending…" : "Send enquiry"}
                </TextButton>
                {mutation.isSuccess ? (
                  <p className="text-sm text-muted-foreground" role="status">
                    Thank you — we will be in touch shortly.
                  </p>
                ) : null}
                {mutation.isError ? (
                  <p className="text-sm text-destructive" role="alert">
                    Unable to send. Please try again.
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
