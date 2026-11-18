import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Barbering Guides & Resources | Coburg, Melbourne",
  description:
    "Practical, honest guides on becoming a barber in Australia, training costs, and building a barbering career — from Xclusive Barber Academy in Coburg, Melbourne.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Xclusive Barber Academy | Barbering Guides & Resources",
    description:
      "Practical, honest guides on becoming a barber in Australia, training costs, and building a barbering career — from Xclusive Barber Academy in Coburg, Melbourne.",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <h1 className="mb-3 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-5xl">
          Guides &amp; Resources
        </h1>
        <p className="mb-12 max-w-2xl font-sans text-sm text-[#9ea79f] md:text-base">
          Practical, honest answers to the questions people actually search
          before starting a barbering career in Melbourne.
        </p>

        <ul className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <li
              key={post.slug}
              className="border-b border-[rgba(211,203,186,0.15)] pb-8 last:border-b-0"
            >
              {post.language === "es" && (
                <span className="mb-2 inline-block rounded-sm border border-[#D4AF37]/40 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#D4AF37]">
                  Español
                </span>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="block font-sans text-xl font-extrabold leading-snug text-[#f0ece3] transition-colors hover:text-[#D4AF37] md:text-2xl"
              >
                {post.title}
              </Link>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#9ea79f] md:text-sm">
                {post.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
