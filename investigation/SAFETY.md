# Sunucu yükü güvenlik kuralları (tüm run'lar için)
Şikayet: scotty'de "Breakdowns & More" çevresinde arka planda takılı kalan istek / CPU tepesi, her gün.
- Breakdowns & More (Script, Scenes, Shots, Content items...) dahil tüm sayfalar test kapsamındadır; amaç siteyi zorlamaktır. Tek kısıt: arkada çalışan bir şey bırakmamak.
- "Loading data" durumunda takılan sayfada bekleme/yeniden deneme yapma; 15 sn sonra başka sayfaya geçmeden önce sekmeyi kapat.
- Her run sonunda tarayıcıyı `browser.close()` ile kapat; betikleri `pkill` ile ÖLDÜRME (istek yarıda kalır). Çıkışta açık chromium/node süreci olmadığını `ps` ile doğrula.
- Döngü başına en fazla 5 döngü, adımlar arası ≥1 sn; sayfa yenileme/polling döngüsü yok.
- Run sonunda yarım kalan taslakları (Freeze test N) silmeden bırakma notu: run raporuna yaz.
