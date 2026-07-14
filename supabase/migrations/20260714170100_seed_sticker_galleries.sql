-- Seed galerias com imagens do bucket catalog/stickers

DO $$
DECLARE
  base TEXT := 'https://mixnbxudvtwspsfthimg.supabase.co/storage/v1/object/public/catalog/stickers/';
BEGIN
  -- 101 Clássicos do Renascimento
  UPDATE public.stickers
  SET image_url = base || 'renasc1_1.jfif'
  WHERE id = 101;

  INSERT INTO public.sticker_images (sticker_id, image_url, sort_order) VALUES
    (101, base || 'renasc1_1.jfif', 0),
    (101, base || 'renasc1_2.jfif', 1),
    (101, base || 'renasc1_3.jfif', 2);

  -- 102 Noites Van Gogh
  UPDATE public.stickers
  SET image_url = base || 'posimpress4_1.jpg'
  WHERE id = 102;

  INSERT INTO public.sticker_images (sticker_id, image_url, sort_order) VALUES
    (102, base || 'posimpress4_1.jpg', 0),
    (102, base || 'posimpress4_2.png', 1);

  -- 103 Brasil Moderno
  UPDATE public.stickers
  SET image_url = base || 'modern2_1.jpg'
  WHERE id = 103;

  INSERT INTO public.sticker_images (sticker_id, image_url, sort_order) VALUES
    (103, base || 'modern2_1.jpg', 0),
    (103, base || 'modern2_2.jpg', 1);

  -- 104 Sonhos Surrealistas
  UPDATE public.stickers
  SET image_url = base || 'surreal5_1.jpg'
  WHERE id = 104;

  INSERT INTO public.sticker_images (sticker_id, image_url, sort_order) VALUES
    (104, base || 'surreal5_1.jpg', 0),
    (104, base || 'surreal5_2.jpg', 1);

  -- 105 Ouro & Amor (Klimt)
  UPDATE public.stickers
  SET image_url = base || 'impress3_1.jpg'
  WHERE id = 105;

  INSERT INTO public.sticker_images (sticker_id, image_url, sort_order) VALUES
    (105, base || 'impress3_1.jpg', 0);
END $$;
