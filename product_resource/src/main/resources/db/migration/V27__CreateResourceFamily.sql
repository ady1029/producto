CREATE TABLE public.resource_family
(
   id serial,
   id_enterprise integer,
   name character varying,
   id_type integer,
   PRIMARY KEY (id),
   FOREIGN KEY (id_type) REFERENCES public.resource_type (id) ON UPDATE CASCADE ON DELETE NO ACTION
)
WITH (
  OIDS = FALSE
)
;
ALTER TABLE public.resource_family
  OWNER TO postgres;



CREATE TABLE public.resource_relation
(
   id_resource integer,
   id_relation integer,
   reference_count double precision,
   measure_unit character varying,
   PRIMARY KEY (id_resource, id_relation),
   FOREIGN KEY (id_resource) REFERENCES public.resource (id) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY (id_relation) REFERENCES public.relation (id) ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS = FALSE
)
;
ALTER TABLE public.resource_relation
  OWNER TO postgres;


ALTER TABLE public.relation RENAME id_resource  TO id_resource_family;
ALTER TABLE public.relation
  DROP CONSTRAINT relation_id_resource_fkey;
ALTER TABLE public.relation
  ADD FOREIGN KEY (id_resource_family) REFERENCES public.resource_family (id) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE public.resource
  DROP CONSTRAINT resource_id_relation_fkey;
ALTER TABLE public.resource
  DROP CONSTRAINT resource_id_type_fkey;
ALTER TABLE public.resource
  DROP COLUMN reference_count;
ALTER TABLE public.resource
  DROP COLUMN measure_unit;
ALTER TABLE public.resource
  DROP COLUMN id_type;
ALTER TABLE public.resource
  DROP COLUMN family;
ALTER TABLE public.resource RENAME id_relation  TO id_resource_family;
ALTER TABLE public.resource
  ADD FOREIGN KEY (id_resource_family) REFERENCES public.resource_family (id) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE public.resource_type
  DROP COLUMN cod_ueb;

