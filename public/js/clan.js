$("#btnSave").click(function (e) {
    e.preventDefault();
    //show loading gif
    $("#btnSave").toggleClass("waiting");
    $.ajax({
        type: "GET",
        url: '/saveclan/543',
        dataType: "json",
        success: function (data) {
            $("#btnSave").toggleClass("waiting");
            $("#btnSave").html(data.text);
        },
        error: function () {//remove gif
            $("#btnSave").toggleClass("waiting");
        }
    });
});