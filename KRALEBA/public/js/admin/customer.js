var category = document.getElementById("categoryProduct");
var boxProvider = document.getElementById('checkProvider');


function checkBoxCustomer() {

    let boxCustomer = document.getElementById("checkCustomer");
    let customerForm = document.getElementById('customerOrProviderForm');

    if (boxCustomer.checked) {
        document.getElementById('checkProvider').checked = false;
        document.getElementById('customerOrProviderForm').style.display = 'none';
        category.style.display = "none";


        customerForm.style.display = "block";

    } else {
        customerForm.style.display = "none";
    }

}

function checkBoxProvider() {

    let boxCustomer = document.getElementById("checkCustomer");

    document.getElementById('customerOrProviderForm').style.display = "none";
    document.getElementById("checkCustomer").checked = false;

    if (boxProvider.checked) {
        category.style.display = "block";
        document.getElementById('customerOrProviderForm').style.display = 'block';

    } else {
        category.style.display = "none";
        document.getElementById('customerOrProviderForm').style.display = 'none';

    }

}

$(".show-subcategory").click(function () {

        var category_id = $("#category_id").val();

        $.ajax({
            url: "/admin/show_subcategory_by_category_id",
            type: 'GET',
            dataType: "json",
            data: {
                category_id: category_id,
            },
            success: function (res) {
                $('#ddlNationality li').remove();
                $('#ddlNationality span').remove();
                $.each(res, function (data, value) {
                    $("#ddlNationality").append($('<span onclick="deleteSubcategory(' + value.subcategory_id + ')" class="fa fa-close" style="float:right; padding-top: 10px; padding-right: 10px"></span>')).append($('<li value=' + value.subcategory_id + '>' + value.name + '</li>'));

                })
                // $("#ddlNationality").append(subcategories);
            }
        });
    }
);

//filter index.blade.php
function filterFunction() {

    document.getElementById("myDropdown").classList.toggle("show");

    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

//Dropdown put in input selected value

function dropDownValue(id) {
    document.getElementById("dropdownInput").value = document.getElementById(id).innerText;

}

//delete subcategory
function deleteSubcategory(id) {
    // console.log(id);

    $.ajax(
        {
            url: "subcategory/" + id,
            type: 'get',
            data: {
                "id": id,
            },
            success: function () {
                $('#subcategory_id_input' + id).remove();
                $("#subcategory_id_delete" + id).remove();
                $("#subcategory_id_label" + id).remove();
                $("#subcategory_id_br" + id).remove();
            }
        }
    );
}

//when is added a new subcategory
function addSubcategoryForCustomersId(category_id) {
    let subcategoryLabel = document.getElementById('subcategoryLabel ' + category_id).value;
    if (!subcategoryLabel) {
        return false;
    }

    $.ajax(
        {
            url: "create_edit/helper_add_subcategory",
            type: 'get',
            data: {
                "category_id": category_id,
                "subcategory_label": subcategoryLabel
            },
            success: function (res) {

                // console.log(res);
                if (res.subcategory_id) {
                    $("#subcategory_list" + category_id)
                        .append($("<input name='subcategories_id[]' id='subcategory_id_input" + res.subcategory_id + "' type='checkbox' value='" + res.subcategory_id + "'>" +
                            " <label id='subcategory_id_label" + res.subcategory_id + "'>" + res.name + " </label>" +
                            "<span style='color: red; cursor: pointer' id='subcategory_id_delete" + res.subcategory_id + "' onclick='deleteSubcategory(" + res.subcategory_id + ")'> X </span>" +
                            "<br id='subcategory_id_br" + res.subcategory_id + "'>"))

                    document.getElementById('subcategoryLabel ' + category_id).value = '';
                }
            }
        }
    );
}

//show existences subcategories
window.onload = (event) => {

    var categories = $('#category').attr("categories");
    var subcategories = $('#category').attr("subcategories");

    if (categories || subcategories) {
        showSubcategoryWhenIsEdited(JSON.parse(categories), JSON.parse(subcategories));
    }
}

function showSubcategoryWhenIsEdited(categories, subcategories) {

    $.each(categories, function (data, value) {

        // showSubcategoryByCategoryId(value, subcategories)
        // console.log(value);
    });
}

function showSubcategoryByCategoryId(category_id, existing_subcategory = null) {
    let category = document.getElementById('category_id ' + category_id);
    if (category.checked) {
        document.getElementById('category_id' + category_id).style.display = 'block';
        $.ajax({
            type: "GET",
            url: "/admin/show_subcategory_by_category_id",
            dataType: "json",
            data: {
                "category_id": category_id,
            },
            contentType: "application/json",
            success: function (res) {
                $.each(res, function (data, value) {
                    $("#subcategory_list" + category_id)
                        .append($("<input name='subcategories_id[]' id='subcategory_id_input" + value.subcategory_id + "' type='checkbox' value='" + value.subcategory_id + "'>" +
                            " <label id='subcategory_id_label" + value.subcategory_id + "'> " + value.name + " </label>" +
                            "<span style='color: red; cursor: pointer' id='subcategory_id_delete" + value.subcategory_id + "' onclick='deleteSubcategory(" + value.subcategory_id + ")'> X </span>" +
                            "<br id='subcategory_id_br" + value.subcategory_id + "'>"))

                    let subcategory = document.getElementById('subcategory_id_input' + value.subcategory_id).value;

                    try {
                        if (existing_subcategory && subcategory.toString() == existing_subcategory[subcategory.toString()]['id']) {
                            document.getElementById('subcategory_id_input' + value.subcategory_id).checked = true;
                        }
                    } catch (e) {
                    }
                })
            }

        });
    } else {
        document.getElementById('category_id' + category_id).style.display = 'none';
        $("#subcategory_list" + category_id + ' input').remove();
        $("#subcategory_list" + category_id + ' label').remove();
        $("#subcategory_list" + category_id + ' span').remove();
        $("#subcategory_list" + category_id + ' br').remove();

    }

}

//download pdf Jquery

$(".download-pdf").click(function () {
    // console.log('sssssss')
    var data = '';
    $.ajax({
        type: 'GET',
        url: '/downloadPDF',
        data: data,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {
            var blob = new Blob([response]);
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "Sample.pdf";
            link.click();
        },
        error: function (blob) {
            console.log(blob);
        }
    });
});


function filterFunction(that, event) {
    let container, input, filter, li, input_val;
    container = $(that).closest(".searchable");
    input_val = container.find("input").val().toUpperCase();

    if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
        keyControl(event, container)
    } else {
        li = container.find("ul li");
        li.each(function (i, obj) {
            if ($(this).text().toUpperCase().indexOf(input_val) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        container.find("ul li").removeClass("selected");
        setTimeout(function () {
            container.find("ul li:visible").first().addClass("selected");
        }, 100)
    }
}

function keyControl(e, container) {
    if (e.key == "ArrowDown") {

        if (container.find("ul li").hasClass("selected")) {
            if (container.find("ul li:visible").index(container.find("ul li.selected")) + 1 < container.find("ul li:visible").length) {
                container.find("ul li.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
            }

        } else {
            container.find("ul li:first-child").addClass("selected");
        }

    } else if (e.key == "ArrowUp") {

        if (container.find("ul li:visible").index(container.find("ul li.selected")) > 0) {
            container.find("ul li.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
        }
    } else if (e.key == "Enter") {
        container.find("input").val(container.find("ul li.selected").text()).blur();
        // onSelect(container.find("ul li.selected").text())
    }

    container.find("ul li.selected")[0].scrollIntoView({
        behavior: "smooth",
    });
}

// function onSelect(val) {
//     alert(val)
// }

$(".searchable input").focus(function () {
    $(this).closest(".searchable").find("ul").show();
    $(this).closest(".searchable").find("ul li").show();
});
$(".searchable input").blur(function () {
    let that = this;
    setTimeout(function () {
        $(that).closest(".searchable").find("ul").hide();
    }, 300);
});

$(document).on('click', '.searchable ul li', function () {
    $(this).closest(".searchable").find("input").val($(this).text()).blur();
    // onSelect($(this).text())
});

$(".searchable ul li").hover(function () {
    $(this).closest(".searchable").find("ul li.selected").removeClass("selected");
    $(this).addClass("selected");
});


/* ------- Bills alert delete --------*/
$('.bills-alert-delete').click(function (event) {
    var form = $(this).closest("form");
    var name = $(this).data("name");
    event.preventDefault();
    swal({
        title: "Esti sigur ca vrei sa stergi factura?",
        text: "Daca stergi factura se vor sterge si articolele din aceasta!",

        icon: "warning",
        type: "warning",
        buttons: ["Cancel", "Yes!"],
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((willDelete) => {
        if (willDelete) {
            form.submit();
        }
    });
});
/* ------- END Bills alert delete --------*/


