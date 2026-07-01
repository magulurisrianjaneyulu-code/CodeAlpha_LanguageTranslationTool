// Country language codes mapping
const countries = {
    "en-GB": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
    "it-IT": "Italian",
    "hi-IN": "Hindi",
    "zh-CN": "Chinese",
    "ar-SA": "Arabic",
    "ja-JP": "Japanese",
    "pt-PT": "Portuguese",
    "ru-RU": "Russian"
};

const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("#translate-btn");
const icons = document.querySelectorAll(".row i");

// Populate select dropdowns with standard supported languages
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // Default select English for "From" and Spanish for "To"
        let selected = id == 0 ? (country_code == "en-GB" ? "selected" : "") : (country_code == "es-ES" ? "selected" : "");
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Swap text and language select dropdowns functionality
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    
    fromText.value = toText.value;
    toText.value = tempText;
    
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Translation Data Flow Logic via Fetch API
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value; // Getting source language value
    let translateTo = selectTag[1].value;   // Getting target language value
    
    if(!text) {
        toText.value = "";
        return;
    }
    
    toText.placeholder = "Translating...";
    
    // Utilizing MyMemory API for seamless, key-less translation handling
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            toText.placeholder = "Translation";
        })
        .catch(error => {
            console.error("Translation Error:", error);
            toText.placeholder = "An error occurred. Try again.";
        });
});

// Optional Features: Copy and Text-to-Speech Click Listeners
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value && !toText.value) return;
        
        // Copy Features
        if(target.id === "from-copy") {
            navigator.clipboard.writeText(fromText.value);
        } else if(target.id === "to-copy") {
            navigator.clipboard.writeText(toText.value);
        } 
        // Text to Speech Features (Web Speech API)
        else {
            let utterance;
            if(target.id === "from-speech") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; 
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; 
            }
            speechSynthesis.speak(utterance);
        }
    });
});
