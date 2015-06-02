# YouTube_360Viewer_WebVR
YouTube360°動画ビューワーWebVR(オンリー)版

##準備
[Chrome WebVRビルド版](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ#list)必須。  
Chrome WebVRビルド版をダウンロードし実行後、
chrome://flags/#enable-webvr にアクセスしたら、Chrome://flagsページのEnable WebVRの項目に直接飛びますので、"有効にする"リンクをクリックして有効にします。  
"今すぐ再起動"ボタンをクリックして、再起動します。  
(ただ、私の環境のせいかもしれませんが、終了するけど起動しないため手動で再度起動します。)

##拡張機能インストール
GitHubの右側にある"Download ZIP"ボタンをクリックし、DL後、解凍します。  
Chrome WebVRビルド版で、右上のメニューボタンをクリックし、”その他ツール"→"拡張機能"を選択し、  
拡張機能のページで、"デベロッパーモード"にチェックします。  
"パッケージ化されていない拡張機能を読み込む…"ボタンをクリックし、解凍したフォルダを選択し、OKボタンをクリックします。  
リストに、"Youtube 360動画ビューワー"の拡張機能が表示されたらOKです。  
(たまにフォルダ選択ダイアログでOKボタンをクリックした時点では、表示されないときがあるのでF5キーを押して更新してみてください。)

##対応動画
360°動画　サンプル：[Medical Realities - Surgical Training in 360-Degree Virtual Reality](https://www.youtube.com/watch?v=VAUbacNs4MQ)  
360°動画SBS　サンプル：[4000x2000【360sbs】](https://www.youtube.com/watch?v=46efEgE9nsA)  
360°動画TAB　サンプル：[【立体視全天周撮影】ユニティちゃん Candy Rock Star ライブステージ！【stereoscopic sphere movie】](https://www.youtube.com/watch?v=_BERVmTEAeM)  
生THETA動画　サンプル：[【Ricoh THETA m15】轉檔前‧雙畫面顯示A](https://www.youtube.com/watch?v=Qp5Z-2MPaek)  
に対応しています。

##操作方法
拡張機能インストール後、各動画にアクセスするとプレイヤーにアイコンが追加されます。
![360ビューワーボタン](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/youtube_extension_button1.png)
この、"360ビューワーに切り替える"ボタンをクリックすと、360ビューワーに切り替わります。  
360ビューワーの状態でPキーを押すごとに、モードが切り替わります。
![モード切替](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mode_loop.png)

