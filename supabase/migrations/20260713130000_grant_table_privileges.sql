-- RLS exige GRANT na tabela além das policies.
-- Sem SELECT, o client autenticado recebe "permission denied for table profiles".

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.artworks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.artworks TO authenticated;

GRANT SELECT ON public.stickers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.stickers TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;
