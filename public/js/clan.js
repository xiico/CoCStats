$("#btnSave").click(function (e) {
    e.preventDefault();
    //show loading gif
    $("#btnSave").toggleClass("waiting");
    $.ajax({
        type: "GET",
        url: '/saveclan/' + $(e.target).attr("data-tag"),
        dataType: "json",
        success: function (data) {
            $("#btnSave").toggleClass("waiting");
            if (data.ok)
                $("#btnSave").html('Saved');
        },
        error: function () {//remove gif
            $("#btnSave").toggleClass("waiting");
        }
    });
});