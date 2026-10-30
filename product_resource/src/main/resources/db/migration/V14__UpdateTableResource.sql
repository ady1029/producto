ALTER TABLE "public"."resource" RENAME COLUMN "id_measure_unit" TO "measure_unit";

ALTER TABLE "public"."resource"
  DROP CONSTRAINT "resource_id_mesuare_unit_fkey",
  ALTER COLUMN "measure_unit" TYPE varchar(256) USING "measure_unit"::varchar(256);