ALTER TABLE "public"."resource_family_relation"
  ALTER COLUMN "id_resource_family" DROP NOT NULL,
  ALTER COLUMN "id_relation" DROP NOT NULL;