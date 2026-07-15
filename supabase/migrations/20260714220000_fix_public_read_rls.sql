-- Anon não tinha EXECUTE em is_admin(), mas as policies SELECT chamavam
-- is_admin() no OR — quebrava leitura pública de artworks/stickers.

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "artworks_public_read_active" ON public.artworks;

CREATE POLICY "artworks_public_read_active"
  ON public.artworks FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "artworks_admin_read_all"
  ON public.artworks FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "stickers_public_read_active" ON public.stickers;

CREATE POLICY "stickers_public_read_active"
  ON public.stickers FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "stickers_admin_read_all"
  ON public.stickers FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "sticker_images_public_read" ON public.sticker_images;

CREATE POLICY "sticker_images_public_read"
  ON public.sticker_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.stickers s
      WHERE s.id = sticker_id
        AND s.status = 'active'
    )
  );

CREATE POLICY "sticker_images_admin_read"
  ON public.sticker_images FOR SELECT
  TO authenticated
  USING (public.is_admin());
