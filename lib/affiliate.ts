export const AMAZON_TAG = "machinefanatic-20";

/**
 * Central URL builder - swap out AMAZON_TAG once your Associates account is approved.
 * ASIN is the 10-character Amazon product identifier (e.g. "B076HCCQZQ").
 */
export function buildAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export const DISCLOSURE_SHORT =
  "MachineFanatic earns a small commission on qualifying Amazon purchases at no extra cost to you.";

export const DISCLOSURE_FULL =
  "MachineFanatic is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. Our editorial opinions are independent and are never influenced by affiliate relationships.";
