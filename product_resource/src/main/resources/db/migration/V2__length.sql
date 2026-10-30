ALTER TABLE "public"."measure_unit"
  ALTER COLUMN "name" TYPE varchar(64) COLLATE "pg_catalog"."default";


ALTER TABLE "public"."product"
  ALTER COLUMN "ueb" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "name" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "cup" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "pharmaceutic_shape" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "presentation_volume" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "market" TYPE varchar(256) COLLATE "pg_catalog"."default";


ALTER TABLE "public"."product_family"
  ALTER COLUMN "enterprice" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "ueb" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "name" TYPE varchar(256) COLLATE "pg_catalog"."default";


ALTER TABLE "public"."relation"
  ALTER COLUMN "name" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "criterio" TYPE varchar(256) COLLATE "pg_catalog"."default";


ALTER TABLE "public"."resource"
  ALTER COLUMN "name" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "cup" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "storage" TYPE varchar(256) COLLATE "pg_catalog"."default";


ALTER TABLE "public"."resource_type"
  ALTER COLUMN "ueb" TYPE varchar(256) COLLATE "pg_catalog"."default",
  ALTER COLUMN "name" TYPE varchar(256) COLLATE "pg_catalog"."default";