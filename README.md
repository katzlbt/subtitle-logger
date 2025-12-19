# Subtitle Logger

Log subtitles on a web stream-player to read them slowly at your own pace, especially if they appear too short to read. Currently this works for the WeTV, Viki and Youku player. As this is a hack, the setup is fragile and may break when the player HTML is changed. Obviously a wide monitor does help that the scroll box does not overlap the movie.

![](/doc/screenshot.png)

# Usage

   1. Open the JS developer console of your web-wrowser when watching a series on wetv.vip, www.viki.com or www.youku.tv
   2. Paste the content of SubtitleLogger.js as text in the console-tab and hit enter (see screenshot).
   3. The log should appear on the bottom left.
   4. You can close the developer section. Repeat after reloading/opening the web-page again.

   ![](/doc/screenshot2.png)

# Tampermonkey

Seems to work with Tampermonkey now. It should be able to automatically activate on supported sites. Installing Tampermonkey is not trivial and needs 2 special permission sliders set to ON (developer-mode and user-scripts).

BUG: Tampermonkey 5.4.1 does not reliably activate the script for all sites:
https://github.com/Tampermonkey/tampermonkey/issues/2629

# Supported Players
    
    - wetv.vip/en/play (tested in Chrome 2025-12)
    - www.youku.tv/v (tested in Chrome 2025-12)
    - www.viki.com (tested in Chrome 2025-12)
