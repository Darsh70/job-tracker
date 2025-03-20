document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveJob');
    const statusElement = document.getElementById('status');
    
    function showStatus(message, isError = false) {
        console.log(`Status: ${message}, isError: ${isError}`);
        statusElement.textContent = message;
        statusElement.style.color = isError ? 'red' : 'green';
    }

    if (!saveButton) {
        console.error('Save button not found');
        return;
    }

    saveButton.addEventListener('click', async function() {
        console.log('Save button clicked');
        saveButton.disabled = true;
        showStatus('Processing...');

        try {
            // Get the current tab's URL
            console.log('Getting current tab...');
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('Current tab URL:', tab?.url);
            
            if (!tab?.url) {
                throw new Error('Could not get current tab URL');
            }

            if (!tab.url.includes('linkedin.com/jobs') && !tab.url.includes('greenhouse.io')) {
                throw new Error('Not a supported job posting. Please open a LinkedIn or Greenhouse job page.');
            }

            // Send the URL to the backend
            console.log('Sending request to backend...');
            const response = await fetch('http://localhost:5001/submitJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: tab.url })
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to save job');
            }

            showStatus('Job saved');
            
        } catch (error) {
            console.error('Error:', error);
            showStatus(error.message || 'An unexpected error occurred', true);
        } finally {
            saveButton.disabled = false;
        }
    });


    console.log('Popup initialized');
});