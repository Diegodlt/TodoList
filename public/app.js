console.log("Hello");

window.onload = function(){
    document.getElementById("requestButton").onclick = function(){
        var myForm = document.createElement("form");
        myForm.action = this.href;
        myForm.method = "GET";
        myForm.action = "/categories"
        myForm.submit();
    }
}