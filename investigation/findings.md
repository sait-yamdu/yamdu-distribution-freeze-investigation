# Findings (cumulative)

- Status: candidate REPRODUCED in cloud (run-20261007T0501Z): 2 persistent renderer hangs (CF1, CF2) out of 3 attempts. Not minimized; root cause unproven.
- Signature: renderer main thread pinned >100% CPU for minutes (still running when killed), memory growing (451->461 MB; 663 MB), DevTools commands unanswered. Native stack samples show JS calling Node.removeChild/insertBefore, MutationObserver record enqueue and table layout (TableRowLayoutAlgorithm) repeatedly = busy DOM mutation loop, i.e. not I/O or a one-shot slow layout. This is consistent with an infinite/very long re-render loop; not a proven leak and not Enter-specific.
- CF1: in sharing modal after typing 'Meine Lieben,' (Enter pending), 4 recipients (8 ticks incl. dept/dupes), external e-mail typed; a draft had been saved earlier in same tab.
- CF2: reopening a saved draft (4 recipients) from Distribution > Drafts in a fresh session.
- Not reproduced: E4-C1 (fresh session, no saved draft, identical modal sequence incl. external e-mail + 'Meine Lieben,' + Enter).
- Leading hypothesis H8: existing saved draft with recipients / external-email contact + modal reopen or following modal open drives a render loop. Needs minimization (see state.json next_experiment).
- Confounds: Chrome Save-password bubble in both screenshots; Xvfb/no WM; CDP-driven; Chromium 141 on Linux (customer: Chrome on macOS/Windows, Firefox, Safari NOT TESTED). The prior run's reading (editor recreation while hidden) is not needed to explain these hangs (page stayed visible).
- Earlier (2026-10-06) runs: E1/E3 not reproduced, E2 blocked; those had no saved-draft-then-reopen preceding state except E3 (saved draft, never reopened).
- 2026-10-07 08:41-08:55Z (run-20261007T0840Z, user-requested live re-run): exact CF2 sequence froze 2/2 (A1 with bubble, A3 without password bubble); exact CF1 sequence froze 1/1 (A2). Freeze is repeatable in this environment. CF2 onset = draft reopen render (no typing); CF1 onset = Enter after "Meine Lieben,". Password bubble and the specific old draft are not required. Click-by-click recipe in runs/run-20261007T0840Z.md.
- 2026-10-07 09:05-09:27Z (run-20261007T0905Z): the user spotted invalid driver navigation. With valid sidebar navigation only (no 404, no loader) CF2 did NOT freeze (0/3). Invalid `#5551/files` (404 + stuck loader) alone: no freeze. Invalid `#5551/scenes` alone added to valid navigation: freeze (C3), as did the original hash path (C2). `#5551/scenes` re-runs the app bootstrap in the same document (third-party scripts re-injected). Freeze onset in CF2 corrected to the Enter after reopen, not the reopen. Earlier "saved draft required" inference withdrawn (confounded). Customer relevance depends on whether a real user path triggers the same re-bootstrap.

## Read this first next run
Known recipe and do-not-repeat list are in state.json (`known_reproduction_recipe`, `do_not_repeat`). Navigate only via sidebar/tab clicks and verify URL/HTTP/console after each navigation.

- 2026-10-08 (run-20261008T0514Z): freeze reproduces with NO saved draft: unknown route (#5551/scenes or #5551/foo) visited earlier in the document, then a new sharing message + Enter (4/4 in R3-1,1b,2a,4); control without it 0/1; full reload after unknown route 0/1; bad-project redirect 0/1. Draft requirement withdrawn. Mechanism still suspected (duplicate init after same-document bootstrap re-run), not proven.
- 2026-10-08 08:00-08:40Z (run-20261008T0759Z): after the dev fix the user reported, unknown routes redirect to dashboard. The R3 recipe no longer freezes (0/2). The user's breadcrumb recipe (25 scene profile/breadcrumb cycles, or 29 pages + 20 cycles, then draft reopen + type + Enter) did not freeze (0/2). The pre-fix breadcrumb recipe is NOT TESTED.

- 2026-10-09 (run-20261009T0514Z): new bundle hash J0ezv... . S1 sustained session (one tab, no reload, 05:17-05:56Z, ~39 min) with 16 genuine hidden phases (45-105 s each) while sharing modal / reopened draft was open, and typing + Enter after each return: NOT REPRODUCED IN THIS EXPERIMENT. Liveness probes <=35 ms, no CANDIDATE, heap 72-111 MB. Limits: ~40% of steps failed from driver defects (stranded on My Calendar 05:30-05:43Z), external-email step never executed (NOT TESTED), Linux Chromium automation only; hidden-tab timer throttling makes heartbeat max (44 s) uninformative.

- 2026-10-10 (run-20261010T0514Z): external-contact -> Select all (41 recipients) -> 6 files (37 MB) -> recipient search -> draft save/reopen -> Next -> Send now, 8 cycles in one tab (~43 min, no reload): NOT REPRODUCED IN THIS EXPERIMENT. 98 liveness probes <=91 ms, no CANDIDATE. First pass blocked by driver defects (not product evidence). Real hidden phases and >1 h age NOT TESTED this run. Native browsers NOT TESTED.

- 2026-10-11 (run-20261011T0513Z): paylasim paneli ('Share files via email': zip adi/expiration/password/renk alanlari + Enter) ile compose arasinda 8 dongu x3 Next/Back, 4 dogrulanmis hidden faz (70 sn) panel acikken, ~45 dk ayni sekme: NOT REPRODUCED IN THIS EXPERIMENT. 177 probe <=234 ms, heap <=126 MB. Alici degistirme (panel sonrasi) driver hatasi nedeniyle NOT TESTED. Native tarayicilar/OS NOT TESTED.

- 2026-10-12 (run-20261012T0515Z): paylasim paneli <-> compose dongusunde alici degistirme (48 harici e-posta, 33->81 alici, Cast&crew arama, Mailing lists sekmesi) + panel-ici Enter alanlari, 16 dongu, 8 arka plan fazi (70 sn), ~45 dk ayni sekme: NOT REPRODUCED IN THIS EXPERIMENT. 305 probe <=21 ms, heap <=233 MB, hata yok. Onceki M2-recip-change 'NOT TESTED' durumu kapandi. Sinirlar: hidden fazlar listener ile dogrulanmadi; yalniz Linux Chromium 141; Send/scheduled/share-link/mailing-list-kaydi ve >1 sa yas NOT TESTED.

- 2026-10-13 (run-20261013T0514Z): yeni bundle JQakff... . M4: Send at a scheduled time diyalogu (saat/tarih secici), gercek Schedule+Cancel schedule (9x), diyalog acikken dogrulanmis 70 sn hidden faz (9x), Store as mailing list (6x), 18 dongu ~35 dk ayni sekme: NOT REPRODUCED IN THIS EXPERIMENT. 211 probe <=17 ms, heap <=179 MB, hata yok. Kazara zamanlama (diyalogda Enter) hemen iptal edildi, gonderim yok. Share via link UI'da yok -> NOT TESTED. Native tarayicilar/OS ve >1 sa yas NOT TESTED; UI-yolu kapsami buyuk olcude tukendi.

- 2026-10-14 (run-20261014T0514Z): yeni bundle --p8nn... . A1: ~63 dk ayni sekme, 7 dongu, 8-10 dk bekleme (3 hidden dogrulandi, 4 gorunur) taslak modali acikken, donus sonrasi Enter: NOT REPRODUCED IN THIS EXPERIMENT. 82 probe <=8 ms, heap <=112 MB, hata yok. Sinirlar: yalniz Linux Chromium 141; >1 sa 3 dk; native tarayici/OS NOT TESTED.

- 2026-10-15 (run-20261015T0516Z): yeni bundle WmM9... . R11 (12-13 alici + harici e-posta, 'Meine Lieben,' Enter, taslak kaydi, bilinmeyen rota, taslak yeniden acma, 3x Enter) ve R12 (bilinmeyen rota 15x birikim + taslak + Enter): NOT REPRODUCED IN THIS EXPERIMENT. Probe <=17 ms, heap <=120 MB, CANDIDATE/CRASH yok. Gozlem: bilinmeyen rota artik dashboard'a yonleniyor ama +13 script ve 404 (templates/scenes/scenes.html) hala var; birikmiyor. Sinirlar: ilk gecis taslagi kaydedilemedi (butonu regex hatasi), yalniz Linux Chromium 141, kisa oturum (~6 dk). Native tarayicilar/OS ve >2 sa NOT TESTED.

- run-20261016T0500Z: build mdvV8... uzerinde R11 regresyonu (R13) NOT REPRODUCED; probe <=14 ms. Kapsam tukenmis durumda; native tarayici/OS/yasli oturum NOT TESTED.

- run-20261018T0508Z: yeni build 38mlI3... uzerinde R14 (R11 akisi) ve R15 (R12 akisi) NOT REPRODUCED IN THIS EXPERIMENT; probe <=19 ms, heap <=123 MB. Native tarayici/OS/yasli (>2 sa) oturum NOT TESTED.

- run-20261019T0500Z: build 38mlI3... degismedi; yeni calistirilabilir hipotez yok, deney yapilmadi (NOT TESTED). Native tarayici/OS ve >2 sa oturum NOT TESTED.

## 2026-10-20 (run-20261020T0500Z)
Build k5WNR0 (38mlI3'ten degisti). R16 (CF1-benzeri akis + bilinmeyen rota + taslak + 3x Enter) ve R17 (15x bilinmeyen rota + Enter) NOT REPRODUCED. Probe <=14 ms, heap <=118 MB, 0 crash. Bilinmeyen rota hala dashboard'a yonleniyor (+13 script, scenes.html 404). Freeze yok; kok neden bilinmiyor; pre-fix REPRODUCED kaydi gecerli.

## 2026-10-21 (run-20261021T0500Z)
Build A5T7Kpp (k5WNR0'dan degisti). R18 (CF1-benzeri akis + bilinmeyen rota + taslak + 3x Enter) ve R19 (15x bilinmeyen rota + Enter) NOT REPRODUCED. 63 probe <=22 ms, heap <=115 MB, 0 crash. Bilinmeyen rota hala dashboard'a yonleniyor (+13 script, scenes.html 404). Kok neden bilinmiyor.

## 2026-10-24 (run-20261024T0500Z)
Build tnZBHIn (A5T7Kpp'den degisti) ve arayuz degisti (ayri Recipients adimi, Save as draft ⋮ menusunde). R20 (CF1-benzeri akis + bilinmeyen rota + taslak + 3x Enter), R21 (15x bilinmeyen rota + Enter) ve R22 (iki adimli Back/Next alici degistirme, 7 tam dongu) NOT REPRODUCED. Probe <=18 ms, heap <=113 MB, 0 crash. Kok neden bilinmiyor; pre-fix REPRODUCED kaydi gecerli. Uzlastirma: m48ee3 ve apuhst dallari ana zincirden kopuk basladi (pre-fix REPRODUCED gecmisini bilmiyorlardi); kayitlari ledger'a aktarildi. Native tarayici/OS, >2 sa oturum, gercek hidden NOT TESTED.
