import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/seo/social-card";

export const alt = "Rock & Paper LP — Clear thinking. Sound counsel.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialCard />, size);
}
