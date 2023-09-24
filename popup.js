document.addEventListener("DOMContentLoaded", function () {
    // Function to get the selected word.
    function getSelectedWord(callback) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const selectedText = window.getSelection().toString();
          return selectedText;
        },
      },
      (result) => {
        const selectedWord = result[0].result;
        callback(selectedWord);
      });
    }
  
   // Replace the fetchWordMeaning function with the Glosbe API endpoint.
function fetchWordMeaning(word, callback) {
  // Glosbe API endpoint for word meanings.
  const apiUrl = `https://glosbe.com/gapi/translate?from=auto&dest=auto&format=json&phrase=${word}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.tuc && data.tuc.length > 0) {
        const meanings = data.tuc[0].meanings.map((meaning) => meaning.text);
        const meaning = meanings.join(', ');
        callback(meaning);
      } else {
        callback("Meaning not found");
      }
    })
    .catch((error) => {
      console.error(error);
      callback("Meaning not found");
    });
}

  
    // Function to speak the word.
    function speakWord(word) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  
    // Add click event listener to the button.
    document.getElementById("getWordMeaning").addEventListener("click", () => {
      getSelectedWord((word) => {
        fetchWordMeaning(word, (meaning) => {
          alert(meaning);
          speakWord(word);
        });
      });
    });
  });
  