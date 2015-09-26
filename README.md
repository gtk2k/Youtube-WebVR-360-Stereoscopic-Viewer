## Setup

WebVR is not supported on Chrome stable/dev/canary yet. You must use a specific [Chrome WebVR build](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ#list), which you can use with the Oculus Rift.

In order to use WebVR, you have to enable it via the settings flags. Access chrome://flags/#enable-webvr and find the "Enable WebVR" flag.  
![enable_webvr](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr.png)  
![down_arrow](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/down_arrow.png)  
![enable_webvr_enabled](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/enable_webvr_enabled.png)  
![reboot](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/reboot_en.png)  

## Installation
Install the extension from the [Chrome Web store](https://chrome.google.com/webstore/detail/youtube-webvr-360-stereos/dklhclnehlegkjdjgjaodcbmffkmagon?hl=en)

## Supported video types
- 360 degree. Example: [Medical Realities - Surgical Training in 360-Degree Virtual Reality](https://www.youtube.com/watch?v=VAUbacNs4MQ)  
- 360 degree stereo side by side. Example: [4000x2000【360sbs】](https://www.youtube.com/watch?v=46efEgE9nsA)  
- 360 degree stereo over/under. Example: [【立体視全天周撮影】ユニティちゃん Candy Rock Star ライブステージ！【stereoscopic sphere movie】](https://www.youtube.com/watch?v=_BERVmTEAeM)  
- Raw THETA. Example: [【Ricoh THETA m15】轉檔前‧雙畫面顯示A](https://www.youtube.com/watch?v=Qp5Z-2MPaek)  

## Usage
After installing the extension, a new "360Viewer" button will appear in the YouTube player:
![360Viewer button](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/youtube_extension_button1.png)  

Click the button to enable the 360Viewer mode. You can drag your mouse to look around the video, like the official YouTube panorama player. 
![mouse drag](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mouse_drag.png)  

Press "P" to change the video type.  
![change video type](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/mode_loop.png)  

Press "X" to turn on/off the anaglyph.
![anaglyph](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/anaglyph.png)

Click the button with the eye icon to enable Oculus Rift mode.
![Oculus Rift button](https://github.com/gtk2k/YouTube_360Viewer_WebVR/blob/master/readme_image/oculus_button.png)  

Press "Z" to recenter the Oculus Rift.

Press "I" to swap the left and right eyes.

## Issues
Vidoe elements with a cross domain "src" are not supported.
