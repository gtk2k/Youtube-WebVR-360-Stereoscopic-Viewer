# YouTube_360Viewer_WebVR
YouTube360°動画ビューワーWebVR版

##準備
Oculus Riftで見る場合、[Chrome WebVRビルド版](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ#list)必須。 Oculus Riftで見ない場合は、Chromeの安定版で構いません。
Oculus Riftで見る場合、Oculus Riftでの表示にWebVRを使用していますので、WebVRを有効にしなければなりません。  
Chrome WebVRビルド版をダウンロードし実行後、
chrome://flags/#enable-webvr にアクセスしたら、Chrome://flagsページのEnable WebVRの項目に直接飛びますので、"有効にする"リンクをクリックして有効にします。 
![enable_webvr](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr.png)  
![down_arrow](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/down_arrow.png)  
![enable_webvr_enabled](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr_enabled.png)  

"今すぐ再起動"ボタンをクリックして、再起動します。  
(ただ、私の環境のせいかもしれませんが、終了するけど起動しないため手動で再度起動します。)
![再起動ボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/reboot.png)  

##拡張機能インストール
[ウェブストア](https://chrome.google.com/webstore/detail/youtube-360%E5%8B%95%E7%94%BB%E3%83%93%E3%83%A5%E3%83%BC%E3%83%AF%E3%83%BC-webvr%E7%89%88/dklhclnehlegkjdjgjaodcbmffkmagon?hl=ja)からインストールします。

##対応動画
360°動画　サンプル：[Medical Realities - Surgical Training in 360-Degree Virtual Reality](https://www.youtube.com/watch?v=VAUbacNs4MQ)  
360°動画SBS　サンプル：[4000x2000【360sbs】](https://www.youtube.com/watch?v=46efEgE9nsA)  
360°動画TAB　サンプル：[【立体視全天周撮影】ユニティちゃん Candy Rock Star ライブステージ！【stereoscopic sphere movie】](https://www.youtube.com/watch?v=_BERVmTEAeM)  
生THETA動画　サンプル：[【Ricoh THETA m15】轉檔前‧雙畫面顯示A](https://www.youtube.com/watch?v=Qp5Z-2MPaek)  
に対応しています。

##操作方法
拡張機能インストール後、YouTubeの動画ページにアクセスするとプレイヤーにアイコンが追加されます。
![360ビューワーボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/youtube_extension_button1.png)  

この、"360ビューワーに切り替える"ボタンをクリックすと、360ビューワーに切り替わります。  
360ビューワーに切り替わるとマウスのドラッグで見る方向を操作することができるようになります。
![マウスドラッグ](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mouse_drag.png)  

360ビューワーの状態でPキーを押すごとに、モードが切り替わります。  
![モード切替](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mode_loop.png)  

また、Oculus Riftが接続されている場合、360ビューワーに切り替えると、"Oculus Riftで見る"ボタンが表示されます。  
このボタンをクリックすると、Oculus Riftで見ることができます。
![Oculus Riftボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/oculus_button.png)

##問題点
Chrome WebVRビルド版はよくクラッシュします。  
Oculus Riftで視聴中は、シークが行えません。
