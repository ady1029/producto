ALTER TABLE "public"."product" RENAME COLUMN "id_measure_unit" TO "measure_unit";

ALTER TABLE "public"."product"
  DROP CONSTRAINT "product_id_mesuare_unit_fkey",
  ALTER COLUMN "measure_unit" TYPE varchar(256) USING "measure_unit"::varchar(256);

