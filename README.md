# Subtitle Logger

Log subtitles on a web stream-player to read them slowly at your own pace, especially if they appear too short to read. Currently this works for the WeTV, Viki and Youku player. As this is a hack, the setup is fragile and may break when the player HTML is changed.

![](/doc/screenshot.png)

# Usage

   1. Open the JS developer console of your web-wrowser when watching a series on wetv.vip, www.viki.com or www.youku.tv
   2. Paste the content of SubtitleLogger.js as text in the console-tab and hit enter (see screenshot).
   3. The log should appear on the bottom left.
   4. You can close the developer section. Repeat after reloading/opening the web-page again.

   ![](/doc/screenshot2.png)

# Tampermonkey

Install Tampermonkey browser extension and add the URL:

    https://raw.githubusercontent.com/katzlbt/subtitle-logger/main/SubtitleLogger.js

# Supported Players
    
    - wetv.vip/en/play (tested in Chrome 2025-12)
    - www.youku.tv/v (tested in Chrome 2025-12)
    - www.viki.com (tested in Chrome 2025-12), page reloads after each episode :-(
