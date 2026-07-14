-- Bucket público para imagens do catálogo (obras e adesivos)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog',
  'catalog',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "catalog_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'catalog');

CREATE POLICY "catalog_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'catalog' AND public.is_admin());

CREATE POLICY "catalog_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'catalog' AND public.is_admin())
  WITH CHECK (bucket_id = 'catalog' AND public.is_admin());

CREATE POLICY "catalog_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'catalog' AND public.is_admin());
