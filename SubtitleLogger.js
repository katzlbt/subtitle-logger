/* jEdit :folding=indent: :collapseFolds=1: :noTabs=true:

   SubtitleLogger for WeTV, Youku, Viki.
   MIT License. Created with help from Google Gemini.
*/

// ==UserScript==
// @name         Subtitle Logger
// @namespace    http://schlaraffenland.de/
// @version      1.1
// @description  Log subtitles on a web stream-player to read them slowly at your own pace, especially if they appear too short to read. Currently this works for the WeTV, Viki and Youku player.
// @author       Cat of all Trades
// @match        https://www.viki.com/videos/*
// @match        https://wetv.vip/en/play/*
// @match        https://www.youku.tv/v/*
// @updateURL    https://raw.githubusercontent.com/katzlbt/subtitle-logger/main/SubtitleLogger.js
// @downloadURL  https://raw.githubusercontent.com/katzlbt/subtitle-logger/main/SubtitleLogger.js
// @run-at       context-menu
// @run-at       document-idle
// @grant        none
// ==/UserScript==

class SubtitleLogger
{
constructor()
    {
        this.observer = null;
        this.logContainer = null;
        this.lastLoggedText = "";
        
        this.subtitleDiv = null;
        this.subtitleContainer = document.body; // default
        
        this.updateContainers = function(){};
        
        this.bottomMargin = '110px';
        
        this.detectStreamer();
        
        this.updateContainers(); // host specific, find subtitle element and container to add log-text
        
        this.createLogContainer();        
        
        this.recreateObserver();
    }
    
detectStreamer() // create this.updateContainers() to find subtitle element and container to add log-text
    {
        if(window.location.host == "wetv.vip") // wetv.vip/en player
        {
            this.updateContainers = () =>
            {
                this.subtitleDiv = document.querySelector('.text-track');
                this.subtitleContainer = document.getElementById('internal-player-wrapper');
            }
            
            return; // >>>>> RETURN >>>>>
        }
         
        if(window.location.host == "www.youku.tv")
        {
            this.updateContainers = () =>
            {
                this.subtitleDiv = document.getElementById('subtitle');
                this.subtitleContainer = document.querySelector('.play-top-container-new');
            }
            
            return; // >>>>> RETURN >>>>>
        }
         
        if(window.location.host == "www.viki.com")
        {
            this.updateContainers = () =>
            {
                this.subtitleDiv = document.querySelector('.vjs-text-track-display');
                this.subtitleContainer = document.getElementById('vmplayer_id');
                //subtitleContainer = document.querySelector('.video-player');
            }
            
            this.bottomMargin = '160px';
            this.watchViki();
            
            return; // >>>>> RETURN >>>>>
        }
        
        alert('The website did not match: ' + window.location.host);
    }
    
createLogContainer() // creates this.logContainer if needed
    {
        if (!this.subtitleDiv) {
            console.error('The target subtitle element was not found.');
            return;
        }
    
        // 1. Target the element where the log will be displayed (we create it if it doesn't exist)
        let logContainer = document.getElementById('subtitle-log');
    
        if (!logContainer) {
            // Create the log container
            logContainer = document.createElement('div');
            logContainer.id = 'subtitle-log';
            this.subtitleContainer.appendChild(logContainer);
    
            // 2. APPLY THE NEW STYLES for absolute positioning and transparency
            logContainer.style.position = 'fixed'; // 'fixed' is best for corner placement, ensuring it stays visible when scrolling
            logContainer.style.zIndex = '9999';    // Ensure it sits on top of all other content
            logContainer.style.color = 'white';    // White text color
            logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
            logContainer.style.padding = '10px';
            logContainer.style.maxWidth = '300px'; // Limit width so it doesn't cover the screen
            logContainer.style.maxHeight = '400px'; // Limit height for scrolling log
            logContainer.style.overflowY = 'scroll'; // Enable scrolling for long logs
            //logContainer.style.pointerEvents = 'none'; // Makes it click-through, so it doesn't interfere with player controls
    
            // 3. SET THE DESIRED CORNER (e.g., Bottom Left)
            logContainer.style.bottom = this.bottomMargin; // past player controls from the bottom edge
            logContainer.style.left = '4px';   // margin from the left edge
            
            // If you wanted Top Left, you would use:
            // logContainer.style.top = '20px';
            // logContainer.style.left = '20px';
            
            logContainer.innerHTML = '<h4>Subtitle Log (Live)</h4>';
            
            this.logContainer = logContainer;
            
            // hide the scrollbar
            const style = document.createElement('style');
            style.innerHTML = "#subtitle-log::-webkit-scrollbar { display: none; }";
            document.head.appendChild(style);
        }
    }
    
recreateObserver() // recreates the mutation observer and moves log-text if something changed
    {
        if(this.observer)
            this.observer.disconnect();
        
        this.updateContainers();
        this.subtitleContainer.appendChild(this.logContainer);
        
        // 4. Define the callback function that runs on every detected change
        var me = this;
        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                // Check if the text content changed (characterData) or structure changed (childList)
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    
                    // Get the current text content from the subtitle div
                    // Use innerText to get formatted text while ignoring hidden elements
                    const newText = me.subtitleDiv.textContent.trim();
                    
                    if (newText && newText != me.lastLoggedText) {
                        //const now = (new Date().toLocaleTimeString()).substring(0,4);
                        const logEntry = document.createElement('p');
                        logEntry.style.margin = '0'; // Tidy up spacing
                        logEntry.style.fontSize = '12px';
                        logEntry.textContent = `> ${newText}`;
                        //logEntry.textContent = `${now}: ${newText}`;
                        
                        // Add the new entry to the log container
                        me.logContainer.appendChild(logEntry);
                        
                        // prevent all duplicates
                        me.lastLoggedText = newText;
                        
                        // Check if the count exceeds the limit
                        if (me.logContainer.children.length > 90) {
                            // Remove the oldest child
                            me.logContainer.removeChild(me.logContainer.firstChild);
                        }
                        
                        // Scroll to the bottom of the log
                        me.logContainer.scrollTop = me.logContainer.scrollHeight;
                    }
                }
            }
        };
    
        // 5. Define the configuration for the observer
        const config = {
            characterData: true,
            subtree: true,
            childList: true,
        };
    
        // 6. Create and start the observer
        if(null == this.observer)
            this.observer = new MutationObserver(callback);
        
        this.observer.observe(this.subtitleDiv, config);
    
        console.log('Subtitle logging successfully set up in the bottom-left corner.');
    }

watchViki() // viki removes our container each episode!
    {
        if(this.logContainer && this.logContainer.parentNode.parentNode == null)
        {
            var subtitleContainer = document.getElementById('vmplayer_id');
            if(subtitleContainer)
            {
                this.recreateObserver();
            }
        }
        
        setTimeout( ()=>{ this.watchViki() }, 10000);
    }
    
remove()
    {
        this.observer.disconnect();
        this.logContainer.remove();
    }
} // class SubtitleLogger

// Ensure the function runs after the document is fully loaded
setTimeout(function(){ window.subtitleLogger = new SubtitleLogger(); },10000);
