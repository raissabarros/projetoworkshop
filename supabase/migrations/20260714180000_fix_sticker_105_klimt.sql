-- Corrige produto 105 (Klimt): remove impress3_1 e atualiza categorias

DELETE FROM public.sticker_images
WHERE sticker_id = 105;

UPDATE public.stickers
SET
  title = 'Ouro & Amor (Klimt)',
  description = '6 adesivos · Art Nouveau · Simbolismo · dourados · laminados',
  note = 'brilho especial ✦',
  image_url = 'https://images.unsplash.com/photo-1578301978693-aa1d4e4c4ef0?w=400&h=400&fit=crop&auto=format'
WHERE id = 105;

-- impress3_1.jpg fica no Storage sem vínculo até definir o produto correto
