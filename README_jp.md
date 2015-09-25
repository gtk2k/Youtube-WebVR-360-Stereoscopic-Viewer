##準備
Oculus Riftで見る場合、[Chrome WebVRビルド版](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ#list)必須です。  
ただし、Chrome WebVRビルド版(でのWebVR機能)は残念ながら、Oculus Runtime 0.7 では動作しません。0.5 か 0.6 のランタイムをインストールすれば動作します。  
未確認ですが、0.5のランタイムであればWin以外のOSでも動作するかもしれません。  
Oculus Riftで見ない場合は、Chromeの安定版で構いません。  

##Chrome WebVRビルド版
デフォルトでは、WebVR機能が有効になっていませんのでWebVR機能を有効にしなければなりません。  
インストールした後、 chrome://flags/#enable-webvr にアクセスしたら、Chrome://flagsページのEnable WebVR の項目に直接飛びますので、"有効にする"リンクをクリックして有効にします。 
![enable_webvr](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr.png)  
![down_arrow](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/down_arrow.png)  
![enable_webvr_enabled](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr_enabled.png)  

"今すぐ再起動"ボタンをクリックして、再起動します。  
(ただ、私の環境のせいかもしれませんが、終了するけど再起動しないため手動で再度起動します。)
![再起動ボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/reboot.png)  

##拡張機能をインストール
[ウェブストア](https://chrome.google.com/webstore/detail/youtube-webvr-360-stereos/ngbcokcpflepmndpmghjdfgjjfhdknpn?utm_source=chrome-ntp-icon)にアクセスし、インストールします。

##対応動画
360°動画サンプル：[Medical Realities - Surgical Training in 360-Degree Virtual Reality](https://www.youtube.com/watch?v=VAUbacNs4MQ)  
360°動画サイドバイサイド(SBS)サンプル：[4000x2000【360sbs】](https://www.youtube.com/watch?v=46efEgE9nsA)  
360°動画トップボトム(TB)サンプル：[【立体視全天周撮影】ユニティちゃん Candy Rock Star ライブステージ！【stereoscopic sphere movie】](https://www.youtube.com/watch?v=_BERVmTEAeM)  
THETA m15 Dual Fisheye動画サンプル：[【Ricoh THETA m15】轉檔前‧雙畫面顯示A](https://www.youtube.com/watch?v=Qp5Z-2MPaek)  
とTHETA SのDualFisheye動画に対応しています。  
ただ、THETA m15とTHETA Sは簡易的にステッチしているためつなぎ目は目立ちます。

##操作方法
拡張機能インストール後、YouTubeの動画ページにアクセスするとプレイヤーにボタンが追加されます。
![360ビューワーボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/youtube_extension_button1.png)  

この、"360ビューワーに切り替える"ボタンをクリックすと、360ビューワーに切り替わります。  
360ビューワーに切り替わるとマウスのドラッグで見る方向を操作することができるようになります。
![マウスドラッグ](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mouse_drag.png)  

360ビューワーの状態でPキーを押すごとに、またはモード名をクリックするごとに、  
360° → 360°SBS → 360°TB → THETA m15 → THETA S → 以降ループ  
というループで、モードが切り替わります。

360°SBSや360°TABモードのときにXキーを押すとアナグリフ表示のON/OFFができます。(現在RED-CYANのみ。今後他のアナグリフに対応するかは未定)
![anaglyph](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/anaglyph.png)

また、Oculus Riftが接続されている場合、360ビューワーに切り替えると、"Oculus Riftで見る"ボタンが表示されます。  
このボタンをクリックすると、Oculus Riftで見ることができます。
![Oculus Riftボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/oculus_button.png)  

Zキーを押すとOculus Riftのセンサーをリセットします(リセンター)。

##問題点

* Chrome WebVRビルド版はよくクラッシュします。  
* Oculus Riftで視聴中は、シークが行えません。ただ、Youtubeプレイヤーがもともと対応しているキーボード操作でのシークなどの操作は可能です。
* 動画によっては、Chrome WebVRビルド版でアクセスすると、videoエレメントのsrc属性に設定されるURLのドメインがgooglevideo.comになるものがあります(Chrome安定版で同じ動画にアクセスしてもyoutube.comドメインになるのですが)。セキュリティによって別ドメインの画像や動画をWebGLのテクスチャーにはできないため、このような動画は現在360ビューワーを使用できないようにしています。
* フルスクリーンにすると、映像が表示されません。
* マウスでの視線方向操作にやや難ありです。
