ALTER TABLE public.product_family
  ADD COLUMN plan_this_year integer DEFAULT 0;
ALTER TABLE public.product_family
  ADD COLUMN plan_next_year integer DEFAULT 0;