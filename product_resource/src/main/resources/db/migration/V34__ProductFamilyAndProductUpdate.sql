ALTER TABLE "public"."product_family"
  ADD COLUMN "format" varchar(255),
  ADD COLUMN "lyophilized" bool,
  ADD COLUMN "reserve" bool,
  ADD COLUMN "atc" varchar(255),
  ADD COLUMN "priority" int4,
  ADD COLUMN "nationalDemand" int4,
  ADD COLUMN "updated" date;


ALTER TABLE "public"."product"
  ADD COLUMN "codigo" varchar(255);