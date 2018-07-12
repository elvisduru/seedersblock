function onChangeCallback(ctr){
    console.log("The country was changed: " + ctr);
}
$(document).ready(function () {
    new NiceCountryInput($("#testinput")).init();
});
