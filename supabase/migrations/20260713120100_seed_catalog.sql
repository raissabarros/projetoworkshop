-- Seed inicial — espelha dados mockados de useArtworks.ts
-- image_url: URLs públicas; Fase 4 pode trocar por assets do site ou Storage

INSERT INTO public.artworks (
  id, title, artist, year, period, period_color, quote, image_url, rotation, status, created_at
) OVERRIDING SYSTEM VALUE
VALUES
  (1, 'Mona Lisa', 'Leonardo da Vinci', '1503–1519', 'Renascimento', 'sage',
   'O sorriso mais enigmático da história da arte',
   'https://images.unsplash.com/photo-1579783902610-a3fb3927b178?w=400&h=520&fit=crop&auto=format',
   -1, 'active', '2024-01-01'),
  (2, 'A Noite Estrelada', 'Vincent van Gogh', '1889', 'Pós-impressionismo', 'blush',
   'Sonho com pintura, então pinto meu sonho',
   'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=520&fit=crop&auto=format',
   1, 'active', '2024-01-02'),
  (3, 'Abaporu', 'Tarsila do Amaral', '1928', 'Modernismo', 'mustard',
   'A mais importante obra da arte moderna brasileira',
   'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=520&fit=crop&auto=format',
   -2, 'active', '2024-01-03'),
  (4, 'A Persistência da Memória', 'Salvador Dalí', '1931', 'Surrealismo', 'coral',
   'O único diferencial entre a loucura e mim é que não sou louco',
   'https://images.unsplash.com/photo-1515405295570-0371a4f088e5?w=400&h=520&fit=crop&auto=format',
   1.5, 'active', '2024-01-04'),
  (5, 'O Beijo', 'Gustav Klimt', '1907–1908', 'Simbolismo', 'mustard',
   'Arte é linha, cor e forma a serviço do amor',
   'https://images.unsplash.com/photo-1578301978693-aa1d4e4c4ef0?w=400&h=520&fit=crop&auto=format',
   -1.5, 'active', '2024-01-05'),
  (6, 'A Dama em Azul', 'Johannes Vermeer', 'c. 1664', 'Barroco', 'sage',
   'Silêncio e luz como linguagem própria',
   'https://images.unsplash.com/photo-1583934583792-262536fa7003?w=400&h=520&fit=crop&auto=format',
   2, 'active', '2024-01-06'),
  (7, 'Flores em Cesta', 'Jan Brueghel, o Velho', 'c. 1615', 'Barroco Flamengo', 'blush',
   'A eternidade capturada em pétalas de tinta',
   'https://images.unsplash.com/photo-1584727638057-78254f636b5a?w=400&h=520&fit=crop&auto=format',
   -2, 'active', '2024-01-07'),
  (8, 'Cena Mitológica', 'Escola Italiana', 'séc. XVII', 'Renascimento', 'sage',
   'Onde os deuses habitam entre os mortais',
   'https://images.unsplash.com/photo-1746039076922-7d8f7c38d972?w=400&h=520&fit=crop&auto=format',
   1, 'active', '2024-01-08');

SELECT setval(pg_get_serial_sequence('public.artworks', 'id'), (SELECT MAX(id) FROM public.artworks));

INSERT INTO public.stickers (
  id, title, description, price, badge, image_url, rotation, note, status
) OVERRIDING SYSTEM VALUE
VALUES
  (101, 'Clássicos do Renascimento', '8 adesivos · vinil fosco · impermeáveis', 45.90, NULL,
   'https://images.unsplash.com/photo-1579783902610-a3fb3927b178?w=400&h=400&fit=crop&auto=format',
   -1, 'feito com amor ✦', 'active'),
  (102, 'Noites Van Gogh', '8 adesivos · brilhosos · cor viva', 45.90, NULL,
   'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&auto=format',
   1.5, 'edição especial', 'active'),
  (103, 'Brasil Moderno', '6 adesivos · Tarsila & amigos · mat', 38.90, 'NOVO',
   'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop&auto=format',
   -2, 'arte brasileira ♥', 'active'),
  (104, 'Sonhos Surrealistas', '8 adesivos · Dalí · vinil holográfico', 52.90, 'LIMITADO',
   'https://images.unsplash.com/photo-1515405295570-0371a4f088e5?w=400&h=400&fit=crop&auto=format',
   1, 'só 200 unidades', 'active'),
  (105, 'Ouro & Amor (Klimt)', '6 adesivos · dourados · laminados', 52.90, 'LIMITADO',
   'https://images.unsplash.com/photo-1578301978693-aa1d4e4c4ef0?w=400&h=400&fit=crop&auto=format',
   -1.5, 'brilho especial ✦', 'active'),
  (106, 'Mix de Mestres', '12 adesivos · seleção curatorial', 68.90, NULL,
   'https://images.unsplash.com/photo-1584727638057-78254f636b5a?w=400&h=400&fit=crop&auto=format',
   2, 'para colecionadores', 'active');

SELECT setval(pg_get_serial_sequence('public.stickers', 'id'), (SELECT MAX(id) FROM public.stickers));
