var modal = document.getElementById("emailmodal");
var email_btn = document.getElementById("email_btn");

email_btn.onclick = function(event) {
    event.preventDefault();
    modal.style.display = "block";
}   


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}