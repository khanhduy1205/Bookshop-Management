// active select all checkbox
var selectAll = $("#selectAll");
var updateAnchor = $('a[name="update"]');
var updateBtn = $("button[name='update']");

if (updateAnchor.length > 0) {

    var hrefVal = updateAnchor.prop('href').toString();

    selectAll.click((e) => {
        if (selectAll.prop('checked') == true) {
            $("table input[type='checkbox']").prop('checked', true);
        }
        else {
            $("table input[type='checkbox']").prop('checked', false);
        }
    })


    $("input").on('click', () => {

        var countChecked = $('table input:checked').length;

        if (countChecked !=  1) {
            updateAnchor.removeAttr('href');
        }
        else {
            updateAnchor.attr('href', hrefVal);
        }
    })
}


if (updateBtn.length > 0) {

    selectAll.click((e) => {
        if (selectAll.prop('checked') == true) {
            $("table input[type='checkbox']").prop('checked', true);
        }
        else {
            $("table input[type='checkbox']").prop('checked', false);
        }
    })


    $("input").on('click', () => {

        var countChecked = $('table input:checked').length;

        console.log(countChecked);
        if (countChecked != 1) {
            updateBtn.prop('disabled', true);
        }
        else {
            updateBtn.prop('disabled', false);
        }
    })
}



