const fullNameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn  = document.getElementById("submit-btn")
const eyeIcon = document.getElementById("eye-icon")
const toastMsg = document.getElementById("toast-msg")

const BASE_URL = "http://127.0.0.1:8000"

const params = new URLSearchParams(window.location.search)


// submitBtn.addEventListener(() => {
// })

eyeIcon.addEventListener("click",() => {
    if(passwordInput.type == "password"){
        passwordInput.type = "text"
        eyeIcon.classList.remove("fa-eye")
        eyeIcon.classList.add("fa-eye-slash")
    }
    else{
        passwordInput.type = "password"
        eyeIcon.classList.remove("fa-eye-slash")
        eyeIcon.classList.add("fa-eye")
    }
})

submitBtn.addEventListener("submit", () => {
    newUser = createUser(fullNameInput.value, emailInput.value, passwordInput.value)

    
})

async function createUser(fullName, email, password){
    const response = await fetch(`${BASE_URL}/admin/signup`,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            email : email,
            name : fullName,
            password : password
        })
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || "Signup Failed")
    }

    return data
}