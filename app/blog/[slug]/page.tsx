import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_SLUGS, getBlogPost, type BlogBlock } from "@/lib/data/blog-posts";
import { getArticleSchema } from "@/lib/seo/article-schema";
import { getServerDictionary } from "@/lib/i18n/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Xclusive Barber Academy`,
      description: post.description,
      url: `/blog/${slug}`,
      locale: post.language === "es" ? "es_ES" : "en_AU",
    },
  };
}

// Renders the program pricing table live from the current dictionary
// (not hardcoded in the article body) so prices never drift out of sync
// with what /courses actually shows.
async function PricingTable() {
  const dictionary = await getServerDictionary();
  const { plans } = dictionary.landing.pricing;

  return (
    <div className="my-8 overflow-hidden rounded-sm border border-[rgba(211,203,186,0.15)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[rgba(211,203,186,0.05)]">
            <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#9ea79f]">
              Program
            </th>
            <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#9ea79f]">
              Price (AUD)
            </th>
            <th className="hidden px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#9ea79f] sm:table-cell">
              Format
            </th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-t border-[rgba(211,203,186,0.1)]">
              <td className="px-4 py-3">
                <Link
                  href={`/courses/${plan.id}`}
                  className="font-sans text-sm font-bold uppercase text-[#f0ece3] transition-colors hover:text-[#D4AF37]"
                >
                  {plan.name}
                </Link>
              </td>
              <td className="px-4 py-3 font-sans text-sm font-semibold text-[#D4AF37]">
                {plan.priceLabel}
              </td>
              <td className="hidden px-4 py-3 font-sans text-sm text-[#9ea79f] sm:table-cell">
                {plan.formatLabel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockRenderer({ block, index }: { block: BlogBlock; index: number }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={index}
          className="mb-3 mt-10 font-sans text-xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-2xl"
        >
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p
          key={index}
          className="mb-4 font-sans text-base leading-relaxed text-[#c8c0ad] md:text-lg"
        >
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="mb-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <svg
                className="mt-[7px] h-2 w-2 flex-shrink-0 text-[#D4AF37]"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              <span className="font-sans text-sm leading-relaxed text-[#dfd8c8] md:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    case "pricingTable":
      return <PricingTable key={index} />;
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = getArticleSchema({
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    inLanguage: post.language,
  });

  const backLabel = post.language === "es" ? "Volver a las guías" : "Back to guides";

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <Link
          href="/blog"
          className="mb-8 inline-block font-sans text-xs uppercase tracking-[0.14em] text-[#9ea79f] transition-colors hover:text-[#D4AF37]"
        >
          {backLabel}
        </Link>

        <h1 className="mb-8 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-5xl">
          {post.title}
        </h1>

        <div>
          {post.body.map((block, index) => (
            <BlockRenderer key={index} block={block} index={index} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-[rgba(211,203,186,0.15)] pt-8">
          {post.ctas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={[
                "relative inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-sm px-6 py-3",
                "font-sans text-[12px] font-black uppercase tracking-[0.08em] text-[#161616] md:text-[13px]",
                "bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60] bg-[length:200%_auto]",
                "shadow-[0_8px_20px_rgba(212,175,55,0.2)]",
                "transition-all duration-300 hover:bg-[position:100%_center] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5",
              ].join(" ")}
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
