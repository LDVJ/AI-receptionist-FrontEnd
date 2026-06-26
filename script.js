const functionPopup = document.getElementById("function-popup");
const functionIcon = document.getElementById("function-icon");
const messageBox = document.getElementById("message-box");
const submitBtn = document.getElementById("submit-btn");
const chatMessages = document.querySelector(".chat-messages");

/* ---------------- Event Listeners ---------------- */

const BASE_URL = "http://127.0.0.1:8000"

functionIcon.addEventListener("click", toggleFunctionPopup);

submitBtn.addEventListener("click", createUserMessage);

messageBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        createUserMessage();
    }
});

/* ---------------- Functions ---------------- */

function toggleFunctionPopup() {
    functionPopup.classList.toggle("active");
}

function createUserMessage() {
    const message = messageBox.value.trim();

    if (!message) return;

    const userMessage = document.createElement("div");
    userMessage.classList.add("user-response");

    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

    userMessage.innerHTML = `
        <div class="data">
            <p class="user-text-send">${message}</p>

            <small class="send-time">
                <i class="fa-regular fa-clock"></i>
                ${currentTime}
            </small>
        </div>

        <div class="pic-container">
            <i class="fa-solid fa-user"></i>
        </div>
    `;

    chatMessages.append(userMessage);

    messageBox.value = "";
    messageBox.focus();

    userMessage.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });
}

function loadingAgentStateStart(){
    let loadElement = document.createElement("div")
    loadElement.classList.add("agent-response", "load")
    
    loadElement.innerHTML = `
    <div class="agent-pic-container">A</div>
            <div class="data">
              <p class="agent-text-send">
                ${"Processing..."}
              </p>
            </div>
    `
    chatMessages.append(loadElement)

}

function loadingAgentStateEnd(){
    let loadElement = document.querySelector(".load")
    loadElement.remove()
}

function createAgentMEssage(message){
    loadingAgentStateStart()
    let newAgentResponse = document.createElement("div")
    newAgentResponse.classList.add("agent-response")
    let currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
    newAgentResponse.innerHTML = `
    <div class="agent-pic-container">A</div>
            <div class="data">
              <p class="agent-text-send">
                ${message}
              </p>
              <small class="send-time"
                ><i class="fa-regular fa-clock"></i> ${currentTime}</small
              >
            </div>
    `
    loadingAgentStateEnd()
    chatMessages.append(newAgentResponse)
}

function renderFaqSuggestion(demo){
    console.log("renderFaqSuggestion ==",demo)
}


async function loadHotelGreeting(){
    try{
        const response = await fetch(`${BASE_URL}/chat/${slug}`)
        
        if(!response.ok){
            console.error("Failed to load Hotel: ",response.status)
            createAgentMEssage("Sorry, We couldn't load this hotel's chat right now.")
            return
        }
        
        const data = await response.json()

        createAgentMEssage(data.welcome_msg);
        
        renderFaqSuggestion(data.faqs)


    }catch(error){
        console.error("Network Error: ", error)
        createAgentMEssage("Something Went Connecting to the Server.")
    }
}


const params = new URLSearchParams(window.location.search)
const slug = params.get("slug")

loadHotelGreeting()