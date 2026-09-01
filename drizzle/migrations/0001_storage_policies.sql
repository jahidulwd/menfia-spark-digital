-- product-images: readable by everyone, writable by admins
create policy "product images public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');
create policy "admins write product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins update product images" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- product-files: admins only; buyers receive signed URLs generated server-side
create policy "admins read product files" on storage.objects for select to authenticated
  using (bucket_id = 'product-files' and public.has_role(auth.uid(), 'admin'));
create policy "admins write product files" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-files' and public.has_role(auth.uid(), 'admin'));
create policy "admins update product files" on storage.objects for update to authenticated
  using (bucket_id = 'product-files' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete product files" on storage.objects for delete to authenticated
  using (bucket_id = 'product-files' and public.has_role(auth.uid(), 'admin'));