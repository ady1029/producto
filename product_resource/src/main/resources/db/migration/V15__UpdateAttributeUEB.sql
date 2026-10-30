ALTER TABLE "public"."resource_type" RENAME COLUMN "ueb" TO "cod_ueb";

ALTER TABLE "public"."resource_type"
  ALTER COLUMN "cod_ueb" TYPE int4 USING "cod_ueb"::int4;

ALTER TABLE "public"."resource" RENAME COLUMN "ueb" TO "cod_ueb";

ALTER TABLE "public"."resource"
  ALTER COLUMN "cod_ueb" TYPE int4 USING "cod_ueb"::int4;