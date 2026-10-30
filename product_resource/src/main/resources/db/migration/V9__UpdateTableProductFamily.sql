ALTER TABLE "public"."product_family" RENAME COLUMN "enterprise" TO "id_enterprise";

ALTER TABLE "public"."product_family" RENAME COLUMN "ueb" TO "cod_ueb";

ALTER TABLE "public"."product_family"
  ALTER COLUMN "id_enterprise" TYPE int4 USING "id_enterprise"::int4,
  ALTER COLUMN "cod_ueb" TYPE int4 USING "cod_ueb"::int4;