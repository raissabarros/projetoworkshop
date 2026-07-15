-- Remove policy temporária usada só para upload das imagens artnov6_*

DROP POLICY IF EXISTS "catalog_temp_stickers_upload" ON storage.objects;
