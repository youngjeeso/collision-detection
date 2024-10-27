const messagesContent = $('.chat');
const messageInput = $('.inputbox');
const messageSubmit = $('.send');

const messages = {};
let messageCount = 0;
const collisionStates = {}; // Track collision states with timestamps and color change flag

function insertMessage() {
    const messageText = messageInput.val().trim();
    if (messageText === '') return;

    playSubmitSound();

    const notDelivered = "A";
    const messageID = `message_${messageCount++}`;

    const messageElement = $("<p class='message box2d' id='" + messageID + "'>" + messageText + "</p>");
    const timeElement = $("<div class='box2d time'>" + notDelivered + "</div>");

    messagesContent.append(messageElement, timeElement);
    messages[messageID] = messageElement;

    console.log('Message sent: ', messageID, messageText);
    messageInput.val(null);
}

function detectCollisions() {
    const messageIDs = Object.keys(messages);

    for (let i = 0; i < messageIDs.length; i++) {
        const messageA = messages[messageIDs[i]];

        for (let j = i + 1; j < messageIDs.length; j++) {
            const messageB = messages[messageIDs[j]];
            const collisionKey = `${messageIDs[i]}-${messageIDs[j]}`;

            if (isColliding(messageA, messageB)) {
                if (!collisionStates[collisionKey]) {
                    collisionStates[collisionKey] = { startTime: Date.now(), colorChanged: false };
                }

                if (!collisionStates[collisionKey].colorChanged) {
                    collisionStates[collisionKey].colorChanged = true;
                    console.log(`Collision detected between ${messageIDs[i]} and ${messageIDs[j]}`);
                    changeColorOnCollision(messageA, messageB);
                }
            } else {
                // Reset collision state when elements are no longer colliding
                collisionStates[collisionKey] = null;
            }
        }
    }
}

// Function to change color on collision only once
function changeColorOnCollision($elem1, $elem2) {
    const randomColor1 = getRandomColor();
    const randomColor2 = getRandomColor();
    $elem1.css('background-color', randomColor1);
    $elem2.css('background-color', randomColor2);
}

// Generate a random color in hexadecimal format
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Basic AABB collision detection function
function isColliding($elem1, $elem2) {
    const rect1 = $elem1[0].getBoundingClientRect();
    const rect2 = $elem2[0].getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Message input and submit button event listener
messageInput.on('keydown', function(e) {
    if (e.which === 13) insertMessage();
});

messageSubmit.on('click', insertMessage);

// Check for collisions periodically
setInterval(detectCollisions, 100); // Check collisions every 100ms

// Function to play sound
function playSubmitSound() {
    var audio = new Audio('./tap.mp3');
    audio.play();
    console.log('Sound played');
}
