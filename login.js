// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function login(user, pass){
    localStorage.setItem("username", user.value);
    localStorage.setItem("password", pass.value);
    window.location = 'loginPage/getData/getData.html'
}

