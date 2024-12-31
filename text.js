var timeoutID; // Variable to store the timeout ID

// Array of different text options
var texts = [
"Hi there! Thanks for your patience while I cook up something fresh for my portfolio. Stay tuned for exciting new projects! In the meantime, you can explore some of my work by clicking on 'Projects' or contact me at oriblich[at]gmail.com.",  
"Website under construction? Nah, it's like a phoenix rising from the ashes! Be back soon with something fiercer than ever. Meanwhile, check out 'Projects' or drop me a line at oriblich[at]gmail.com.",  
"Attention, adventurers! This page is still uncharted territory. For exclusive sneak peeks, click on 'Projects' or send a message to oriblich[at]gmail.com.",  
"Got a creative challenge for me? My inbox is open at oriblich[at]gmail.com while I build my new online haven. You can also explore my work under 'Projects'.",  
"My website is under construction, much like my ever-expanding collection of coffee mugs. Check back soon for fresh designs and caffeinated brilliance. In the meantime, click on 'Projects' or email me at oriblich[at]gmail.com.",  
"Like a sculptor chipping away at marble, I'm refining my online masterpiece. Patience, dear visitor, the chisel never sleeps. For a peek, check 'Projects' or send a whisper to oriblich[at]gmail.com.",  
"Behind the scenes, my pixels are dancing in a digital fiesta. Get ready for the grand portfolio premiere! But if you need a backstage pass, explore 'Projects' or whisper at oriblich[at]gmail.com.",  
"My website is on vacation, sunbathing on the pixels of the internet. Stay tuned for its triumphant return, or explore 'Projects' and send a witty message to oriblich[at]gmail.com.",  
"Welcome to the construction zone of creativity! While I'm busy laying the bricks for my new portfolio, feel free to leave your mark. Click on 'Projects' or send your graffiti to oriblich[at]gmail.com.",  
"My website is busy building sandcastles on the beach of the internet. Come join the fun when it reopens! Until then, click on 'Projects' or email me at oriblich[at]gmail.com.",  
];
var lastTextIndex = -1;

// Function to change the text with typing animation
function changeText() {
    var newTextIndex;

    do {
        // Get a random index
        newTextIndex = Math.floor(Math.random() * texts.length);
    } while (newTextIndex === lastTextIndex); // Ensure the new text is different from the last one

    // Clear the timeout if it's set
    clearTimeout(timeoutID);

    // Set the dynamic text to an empty string initially
    document.getElementById("dynamicText").innerHTML = '';

    // Update the last text index
    lastTextIndex = newTextIndex;

    // Start typing animation
    typingAnimation(texts[newTextIndex], 0);
}

// Function to perform typing animation
function typingAnimation(text, index) {
    if (index < text.length) {
        var currentChar = text.charAt(index);
        var nextChar = '';

        // Check if the current character is a special character
        switch (currentChar) {
            case '<':
                nextChar = '&lt;';
                break;
            case '>':
                nextChar = '&gt;';
                break;
            case '&':
                nextChar = '&amp;';
                break;
            default:
                nextChar = currentChar;
        }

        // Append the next character to the dynamic text
        document.getElementById("dynamicText").innerHTML += nextChar;
        index++;

        // Call the function recursively with a delay to simulate typing speed
        timeoutID = setTimeout(function () {
            typingAnimation(text, index);
        }, 50); // Adjust typing speed here (lower value for faster typing)
    }
}

// Call the function initially to set the initial text
changeText();
document.body.style.overflow = 'hidden';

