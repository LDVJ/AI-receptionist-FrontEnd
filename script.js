const functionPopup = document.getElementById("function-popup");
const functionIcon = document.getElementById("function-icon");
const messageBox = document.getElementById("message-box");
const submitBtn = document.getElementById("submit-btn");
const chatMessages = document.querySelector(".chat-messages");

/* ---------------- Event Listeners ---------------- */

// const BASE_URL = "http://127.0.0.1:8000"
const BASE_URL = "https://ai-receptionist-6we2.onrender.com"
const params = new URLSearchParams(window.location.search)
const slug = params.get("slug")

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

async function createUserMessage() {
    const question = messageBox.value.trim();
    if (!question) return;
    const userQuestion = document.createElement("div");
    userQuestion.classList.add("user-response");
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
    userQuestion.innerHTML = `
        <div class="data">
            <p class="user-text-send">${question}</p>

            <small class="send-time">
                <i class="fa-regular fa-clock"></i>
                ${currentTime}
            </small>
        </div>
        <div class="pic-container">
            <i class="fa-solid fa-user"></i>
        </div>
    `;

    chatMessages.append(userQuestion);

    messageBox.value = "";
    messageBox.focus();

    userQuestion.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

    loadingAgentStateStart()
    await ProcessResponse(question)
    loadingAgentStateEnd()

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
    loadElement.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

}

function loadingAgentStateEnd(){
    let loadElement = document.querySelectorAll(".load")
    loadElement.forEach(removeElemeent => {
        removeElemeent.remove()
    })
}

async function ProcessResponse(question){
    const response = await fetch(`${BASE_URL}/chat/${slug}`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            question: question
        })
    })

    const data = await response.json()

    createAgentResponse(data.answer)
}

// function renderFaqSuggestion(demo){
//     console.log("renderFaqSuggestion ==",demo)
// }


async function loadHotelGreeting(){
    try{
        const response = await fetch(`${BASE_URL}/chat/${slug}`, {
            method: "GET",
        })
        
        if(!response.ok){
            console.error("Failed to load Hotel: ",response.status)
            createAgentMEssage("Sorry, We couldn't load this hotel's chat right now.")
            return
        }
        
        const data = await response.json()
        console.log(data)
        createAgentResponse(data.welcome_msg)


    }catch(error){
        console.error("Network Error: ", error)
        createAgentMEssage("Something Went Connecting to the Server.")
    }
}


function createAgentResponse(response){

    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
    let newAgentResponse = document.createElement("div")
    newAgentResponse.classList.add("agent-response")

    newAgentResponse.innerHTML = `
    <div class="agent-pic-container">A</div>
            <div class="data">
              <p class="agent-text-send">
                ${response}
              </p>
              <small class="send-time"
                ><i class="fa-regular fa-clock"></i> ${currentTime}</small
              >
            </div>
    `
    chatMessages.append(newAgentResponse)

    newAgentResponse.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });
}


loadHotelGreeting()
