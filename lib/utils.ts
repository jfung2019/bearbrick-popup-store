import { clsx, type ClassValue } from "clsx"
import sanitizeHtml from "sanitize-html"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePrice(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function sanitizeRichHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "figure",
      "figcaption",
      "img",
      "pre",
      "code",
      "span",
      "div",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding", "srcset", "sizes", "class"],
      figure: ["class"],
      figcaption: ["class"],
      p: ["class"],
      span: ["class"],
      div: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: true,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  })
}
