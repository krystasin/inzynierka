export function printMessage(message, hideDelay = 2000) {
    let popup = document.getElementById('popup')
    console.log(popup);
    popup.innerText = message
    popup.classList.toggle("show");
    setTimeout(() => {
        popup.innerText = "" 
        popup.classList.toggle("show");
    }, hideDelay);
}
