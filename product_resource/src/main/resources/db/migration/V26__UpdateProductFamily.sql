ALTER TABLE "public"."product_family"
  DROP COLUMN "cod_ueb";

ALTER TABLE "public"."product"
  ADD COLUMN "cod_ueb" int4;