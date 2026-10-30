ALTER TABLE "public"."product"
  DROP COLUMN "ueb",
  DROP COLUMN "name",
  DROP COLUMN "pharmaceutic_shape",
  DROP COLUMN "market",
  ALTER COLUMN "presentation_volume" TYPE float8 USING "presentation_volume"::float8;