import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const rows = await sql`
    SELECT 
      c."Id" AS config_id,
      c."Slug" AS slug,
      c."IsActive" AS is_active,
      c."StartDate" AS start_date,
      c."EndDate" AS end_date,
      s."Id" AS section_id,
      s."LandingPageConfigId" AS landing_page_config_id,
      s."SectionType" AS section_type,
      s."HtmlContent" AS html_content,
      s."MetaData" AS meta_data,
      s."Price" AS price,
      s."DiscountPrice" AS discount_price,
      s."IsVisible" AS is_visible,
      s."Order" AS "order"
    FROM "LandingPageConfigs" c
    LEFT JOIN "LandingPageSections" s 
      ON s."LandingPageConfigId" = c."Id"
    WHERE LOWER(c."Slug") = LOWER(${slug});
  `;

  if (rows.length === 0) return NextResponse.json(null);

  const config = {
    id: rows[0].config_id,
    slug: rows[0].slug,
    isActive: rows[0].is_active,
    startDate: rows[0].start_date,
    endDate: rows[0].end_date,
    sections: rows
      .filter((r: any) => r.section_id)
      .map((r: any) => ({
        id: r.section_id,
        sectionType: r.section_type,
        htmlContent: r.html_content
          ?.replaceAll("className=", "class=")
          ?.replace(/\{\s*"?\s*"\s*\}/g, " ")
          ?.replace(/\r?\n|\r/g, "") || "",
        metaData: r.meta_data
          ? typeof r.meta_data === "string"
            ? JSON.parse(r.meta_data)
            : r.meta_data
          : null,
        price: r.price,
        discountPrice: r.discount_price,
        isVisible: r.is_visible,
        order: r.order,
      })),
  };

  return NextResponse.json(config);
}