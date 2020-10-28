$(document).ready(function () {
    $("#search").click(function () {
        document.getElementById('res').innerHTML = ''
        $.ajax({
            url: "/search?key=" + document.getElementById('key').value
        }).done(function (data) {
            if (data.length > 0) {
                jQuery.each(data, function (i, val) {
                    $('#res').append('<h4>Name:&nbsp;'+val.name + '&emsp14;&emsp14;&emsp14;&emsp14; Location:&nbsp;' + val.location + '</h4><br>')
                })
            } else {
                $("#res").html('<h4>No Users Found</h4>');
            }
        }).fail(function (err) {
            console.error(err);
        });
    });
});

function remove(id) {
    console.log(id)
    fetch('/remove?id=' + id, {
        method: 'delete',
    }).then(res => {
        if (res.ok){}
    }).then(data => {
        window.location.reload()
    }).catch(err => console.log(err))
}
