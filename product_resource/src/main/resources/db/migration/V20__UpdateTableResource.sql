ALTER TABLE "public"."resource" RENAME COLUMN "cup" TO "codigo";

ALTER TABLE "public"."resource"
  DROP COLUMN "name";

INSERT INTO public.measure_unit(name)VALUES ('MU');
INSERT INTO public.measure_unit(name)VALUES ('U');