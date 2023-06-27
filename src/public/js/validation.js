const regex_fields = {
    fullname: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
    // fullname: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    username: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    pass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    phone: /0[0-9][0-9]{8}\b/,
    email: /^[a-z][a-z0-9_\.]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
};

const error_messages = {
    fullname: "Họ tên không dấu, không bắt đầu bằng khoảng trắng, không chứa ký số và ký tự đầu phải viết hoa",
    username: "Không được có khoảng trắng, chỉ gồm các ký tự, ký số và dấu _, không được bắt đầu bằng ký số",
    pass: "Mật khẩu phải ít nhất 8 ký tự, ít nhất 1 ký số",
    phone: "Số điện thoại phải theo chuẩn 10 số, bắt đầu bằng số 0",
    email: "Email không đúng chuẩn",
    repass: "Mật khẩu xác nhận không trùng khớp",
};

function checkPassword(pwd, re_pwd) {
    return pwd.value === re_pwd.value;
}

$('.validate-form').submit((e) => {
    const keys = $('input[id$="Regex"]');

    for (var item of keys) {

        let name = item.attributes.name.value;

        console.log(item.value + " test: " + regex_fields[name]);
   
        if (regex_fields[name].test(item.value)) {
            console.log("true");

            item.style.borderColor = null;

            var alert = $(`span p[id="${name}Valid"]`);
            alert.removeClass('input-error');
            alert.prop('display', 'none');
            alert.html("");
        }
        else {
            item.style.borderColor = "red";
            console.log("false");

            var alert = $(`span p[id="${name}Valid"]`);
            alert.html(error_messages[name]);
            alert.addClass('input-error');
            alert.prop('display', 'inline');

            e.preventDefault();
        }
    }

    const password = document.getElementById('passRegex');
    const rePassword = document.getElementById('repass');
    var alert = $('span p[id="repassValid"]');

    if (!checkPassword(password, rePassword)) {

        rePassword.style.borderColor = "red";

        alert.html(error_messages["repass"]);
        alert.addClass('input-error');

        e.preventDefault();
    }
    else {
        rePassword.style.borderColor = null;
       
        alert.removeClass('input-error');
        alert.html("");
    }
})
