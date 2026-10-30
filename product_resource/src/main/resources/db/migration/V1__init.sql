/*
 Navicat Premium Data Transfer

 Source Server         : Postgres 9.5
 Source Server Type    : PostgreSQL
 Source Server Version : 90502
 Source Host           : localhost:5433
 Source Catalog        : product_resource_manual
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90502
 File Encoding         : 65001

 Date: 03/09/2020 14:41:39
*/


-- ----------------------------
-- Sequence structure for mesuare_unit_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."mesuare_unit_id_seq";
CREATE SEQUENCE "public"."mesuare_unit_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_family_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_family_id_seq";
CREATE SEQUENCE "public"."product_family_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_id_seq";
CREATE SEQUENCE "public"."product_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for relation_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."relation_id_seq";
CREATE SEQUENCE "public"."relation_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for resource_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."resource_id_seq";
CREATE SEQUENCE "public"."resource_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for resource_type_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."resource_type_id_seq";
CREATE SEQUENCE "public"."resource_type_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for measure_unit
-- ----------------------------
DROP TABLE IF EXISTS "public"."measure_unit";
CREATE TABLE "public"."measure_unit" (
  "id" int4 NOT NULL DEFAULT nextval('mesuare_unit_id_seq'::regclass),
  "name" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS "public"."product";
CREATE TABLE "public"."product" (
  "id" int4 NOT NULL DEFAULT nextval('product_id_seq'::regclass),
  "ueb" varchar COLLATE "pg_catalog"."default",
  "name" varchar COLLATE "pg_catalog"."default",
  "cup" varchar COLLATE "pg_catalog"."default",
  "pharmaceutic_shape" varchar COLLATE "pg_catalog"."default",
  "presentation_volume" varchar COLLATE "pg_catalog"."default",
  "market" varchar COLLATE "pg_catalog"."default",
  "id_product_family" int4,
  "id_mesuare_unit" int4
)
;

-- ----------------------------
-- Table structure for product_family
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_family";
CREATE TABLE "public"."product_family" (
  "id" int4 NOT NULL DEFAULT nextval('product_family_id_seq'::regclass),
  "enterprice" varchar COLLATE "pg_catalog"."default",
  "ueb" varchar COLLATE "pg_catalog"."default",
  "name" varchar COLLATE "pg_catalog"."default",
  "date" date
)
;

-- ----------------------------
-- Table structure for product_relation
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_relation";
CREATE TABLE "public"."product_relation" (
  "id_product" int4 NOT NULL,
  "id_relation" int4 NOT NULL
)
;

-- ----------------------------
-- Table structure for relation
-- ----------------------------
DROP TABLE IF EXISTS "public"."relation";
CREATE TABLE "public"."relation" (
  "id" int4 NOT NULL DEFAULT nextval('relation_id_seq'::regclass),
  "name" varchar COLLATE "pg_catalog"."default",
  "criterio" varchar COLLATE "pg_catalog"."default",
  "date" date,
  "id_product" int4,
  "id_resource" int4,
  "base_count" int4
)
;

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS "public"."resource";
CREATE TABLE "public"."resource" (
  "id" int4 NOT NULL DEFAULT nextval('resource_id_seq'::regclass),
  "id_relation" int4,
  "name" varchar COLLATE "pg_catalog"."default",
  "cup" varchar COLLATE "pg_catalog"."default",
  "storage" varchar COLLATE "pg_catalog"."default",
  "reference_count" float8,
  "id_mesuare_unit" int4,
  "id_type" int4
)
;

-- ----------------------------
-- Table structure for resource_type
-- ----------------------------
DROP TABLE IF EXISTS "public"."resource_type";
CREATE TABLE "public"."resource_type" (
  "id" int4 NOT NULL DEFAULT nextval('resource_type_id_seq'::regclass),
  "ueb" varchar COLLATE "pg_catalog"."default",
  "name" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."mesuare_unit_id_seq"
OWNED BY "public"."measure_unit"."id";
SELECT setval('"public"."mesuare_unit_id_seq"', 2, false);
ALTER SEQUENCE "public"."product_family_id_seq"
OWNED BY "public"."product_family"."id";
SELECT setval('"public"."product_family_id_seq"', 2, false);
ALTER SEQUENCE "public"."product_id_seq"
OWNED BY "public"."product"."id";
SELECT setval('"public"."product_id_seq"', 2, false);
ALTER SEQUENCE "public"."relation_id_seq"
OWNED BY "public"."relation"."id";
SELECT setval('"public"."relation_id_seq"', 2, false);
ALTER SEQUENCE "public"."resource_id_seq"
OWNED BY "public"."resource"."id";
SELECT setval('"public"."resource_id_seq"', 2, false);
ALTER SEQUENCE "public"."resource_type_id_seq"
OWNED BY "public"."resource_type"."id";
SELECT setval('"public"."resource_type_id_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table measure_unit
-- ----------------------------
ALTER TABLE "public"."measure_unit" ADD CONSTRAINT "unity_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table product_family
-- ----------------------------
ALTER TABLE "public"."product_family" ADD CONSTRAINT "product_family_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table product_relation
-- ----------------------------
ALTER TABLE "public"."product_relation" ADD CONSTRAINT "product_relation_pkey" PRIMARY KEY ("id_product", "id_relation");

-- ----------------------------
-- Primary Key structure for table relation
-- ----------------------------
ALTER TABLE "public"."relation" ADD CONSTRAINT "relation_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table resource
-- ----------------------------
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table resource_type
-- ----------------------------
ALTER TABLE "public"."resource_type" ADD CONSTRAINT "resource_type_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_id_mesuare_unit_fkey" FOREIGN KEY ("id_mesuare_unit") REFERENCES "public"."measure_unit" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."product" ADD CONSTRAINT "product_id_product_family_fkey" FOREIGN KEY ("id_product_family") REFERENCES "public"."product_family" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table product_relation
-- ----------------------------
ALTER TABLE "public"."product_relation" ADD CONSTRAINT "product_relation_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "public"."product" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."product_relation" ADD CONSTRAINT "product_relation_id_relation_fkey" FOREIGN KEY ("id_relation") REFERENCES "public"."relation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table relation
-- ----------------------------
ALTER TABLE "public"."relation" ADD CONSTRAINT "relation_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "public"."product" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."relation" ADD CONSTRAINT "relation_id_resource_fkey" FOREIGN KEY ("id_resource") REFERENCES "public"."resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table resource
-- ----------------------------
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_id_mesuare_unit_fkey" FOREIGN KEY ("id_mesuare_unit") REFERENCES "public"."measure_unit" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_id_relation_fkey" FOREIGN KEY ("id_relation") REFERENCES "public"."relation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."resource" ADD CONSTRAINT "resource_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "public"."resource_type" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
