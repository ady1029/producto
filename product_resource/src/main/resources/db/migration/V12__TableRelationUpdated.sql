ALTER TABLE "public"."relation"
  ADD COLUMN "id_product_family" int4,
  ADD FOREIGN KEY ("id_product_family") REFERENCES "public"."product_family" ("id") ON DELETE CASCADE ON UPDATE CASCADE;