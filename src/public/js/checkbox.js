// active select all checkbox
var selectAll = $("#selectAll");
var updateBtn = $("a[name='update']");
var hrefVal = updateBtn.prop('href').toString();

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

    if (countChecked > 1) {
        updateBtn.removeAttr('href');
    }
    else {
        updateBtn.attr('href', hrefVal);
    }
})