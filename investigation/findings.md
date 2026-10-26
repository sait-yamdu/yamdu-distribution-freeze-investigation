# Bulgular

## Durum: Yeniden üretim YOK (şimdiye kadar)
- Geçmiş H-001..H-007 içe aktarıldı (bu run'da yapılmadı).

## Yeni gözlemler (run-20261026T0509Z)
1. **Editör Froala değil**: Bu scotty build'inde mesaj/imza editörü Tiptap/ProseMirror (Mantine RichTextEditor). Geçmişteki Froala/dinleyici sızıntısı çıkarımları bu build için geçerli olmayabilir; H-004 (Froala simülasyonu) önemini yitiriyor.
2. Modal aç/kapa/taslak yeniden açma sırasında editör kökünün yeniden oluşturulması NORMAL bir yaşam döngüsüdür (aç/kapa ile birebir eşleşiyor); freeze/resume sırasında beklenmedik yeniden oluşum gözlenmedi.
3. Alıcı seçimi `.sharing-recipient-item` tıklamasıyla; kapatma "Discard changes" onayı gerektirir (otomasyon tuzağı).
4. Bulutta gerçek tab-hidden elde edilemedi (headless ve Xvfb headed'de ikinci sekme birinciyi gizlemiyor).
