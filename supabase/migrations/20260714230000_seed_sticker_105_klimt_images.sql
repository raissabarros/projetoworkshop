-- Imagens da cartela Ouro & Amor (Klimt) — sticker id 105
-- Arquivos: catalog/stickers/artnov6_1.png, artnov6_2.png

UPDATE public.stickers
SET image_url = 'https://mixnbxudvtwspsfthimg.supabase.co/storage/v1/object/public/catalog/stickers/artnov6_1.png'
WHERE id = 105;

DELETE FROM public.sticker_images
WHERE sticker_id = 105;

INSERT INTO public.sticker_images (sticker_id, image_url, sort_order)
VALUES
  (
    105,
    'https://mixnbxudvtwspsfthimg.supabase.co/storage/v1/object/public/catalog/stickers/artnov6_1.png',
    0
  ),
  (
    105,
    'https://mixnbxudvtwspsfthimg.supabase.co/storage/v1/object/public/catalog/stickers/artnov6_2.png',
    1
  );
