/*
   SubtitleLogger for WeTV by Tencent.
   MIT License. Created with help from gGoogle Gemini. 
   
   1. Open the developer console when watching a series
   2. Paste the whole file in the console and hit enter.
*/

class SubtitleLogger
{ 
constructor() {
    
    this.lastLoggedText = "";
    
    let subtitleDiv = null;
    
    if(window.location.host == "wetv.vip") // wetv.vip/en player
        subtitleDiv = document.querySelector('.text-track');
    /*TODO: else 
    if(window.location.host == "www.youku.tv") // wetv.vip/en player
        subtitleDiv = document.querySelector('.text-track');
    else 
    if(window.location.host == "www.viki.com") // wetv.vip/en player
        subtitleDiv = document.querySelector('.text-track');
    */
    
    if (!subtitleDiv) {
        console.error('The target subtitle element was not found.');
        return;
    }

    // 1. Target the element where the log will be displayed (we create it if it doesn't exist)
    let logContainer = document.getElementById('subtitle-log');

    if (!logContainer) {
        // Create the log container
        logContainer = document.createElement('div');
        logContainer.id = 'subtitle-log';
        document.body.appendChild(logContainer);

        // 2. APPLY THE NEW STYLES for absolute positioning and transparency
        logContainer.style.position = 'fixed'; // 'fixed' is best for corner placement, ensuring it stays visible when scrolling
        logContainer.style.zIndex = '9999';    // Ensure it sits on top of all other content
        logContainer.style.color = 'white';    // White text color
        logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
        logContainer.style.padding = '10px';
        logContainer.style.maxWidth = '300px'; // Limit width so it doesn't cover the screen
        logContainer.style.maxHeight = '400px'; // Limit height for scrolling log
        logContainer.style.overflowY = 'scroll'; // Enable scrolling for long logs
        logContainer.style.pointerEvents = 'none'; // Makes it click-through, so it doesn't interfere with player controls

        // 3. SET THE DESIRED CORNER (e.g., Bottom Left)
        logContainer.style.bottom = '20px'; // 20px margin from the bottom edge
        logContainer.style.left = '20px';   // 20px margin from the left edge
        
        // If you wanted Top Left, you would use:
        // logContainer.style.top = '20px';
        // logContainer.style.left = '20px';
        
        logContainer.innerHTML = '<h4>Subtitle Log (Live)</h4>';
    }
        
    // 4. Define the callback function that runs on every detected change
    var me = this;
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            // Check if the text content changed (characterData) or structure changed (childList)
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                
                // Get the current text content from the subtitle div
                // Use innerText to get formatted text while ignoring hidden elements
                const newText = subtitleDiv.textContent.trim();
                
                if (newText && newText != me.lastLoggedText) {
                    //const now = (new Date().toLocaleTimeString()).substring(0,4);
                    const logEntry = document.createElement('p');
                    logEntry.style.margin = '0'; // Tidy up spacing
                    logEntry.style.fontSize = '12px';
                    logEntry.textContent = `> ${newText}`;
                    //logEntry.textContent = `${now}: ${newText}`;
                    
                    // Add the new entry to the log container
                    logContainer.appendChild(logEntry);
                    
                    // prevent all duplicates
                    me.lastLoggedText = newText;
                    
                    // Check if the count exceeds the limit
                    if (logContainer.children.length > 30) {
                        // Remove the oldest child
                        logContainer.removeChild(logContainer.firstChild);
                    }
                    
                    // Scroll to the bottom of the log
                    logContainer.scrollTop = logContainer.scrollHeight;               
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
    const observer = new MutationObserver(callback);
    observer.observe(subtitleDiv, config);

    console.log('Subtitle logging successfully set up in the bottom-left corner.');
}
} // class SubtitleLogger

// Ensure the function runs after the document is fully loaded
new SubtitleLogger();
