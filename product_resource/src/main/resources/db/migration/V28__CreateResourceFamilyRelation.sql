DROP TABLE public.resource_relation;


CREATE TABLE public.resource_family_relation
(
   id_resource_family integer,
   id_relation integer,
   reference_count double precision,
   measure_unit character varying,
   PRIMARY KEY (id_resource_family, id_relation),
   FOREIGN KEY (id_resource_family) REFERENCES public.resource_family (id) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY (id_relation) REFERENCES public.relation (id) ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS = FALSE
)
;
ALTER TABLE public.resource_family_relation
  OWNER TO postgres;