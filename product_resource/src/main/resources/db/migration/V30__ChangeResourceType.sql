ALTER TABLE public.resource_family
  DROP COLUMN id_type;

ALTER TABLE public.resource_family_relation
  ADD COLUMN id_type integer;
ALTER TABLE public.resource_family_relation
  ADD FOREIGN KEY (id_type) REFERENCES public.resource_type (id) ON UPDATE CASCADE ON DELETE NO ACTION;