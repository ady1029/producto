ALTER TABLE public.resource_family_relation
  ADD COLUMN id serial;
ALTER TABLE public.resource_family_relation
  DROP CONSTRAINT resource_family_relation_pkey;
ALTER TABLE public.resource_family_relation
  ADD PRIMARY KEY (id);
