$(function () {
    let dialog, form,
        alphabet = /^['а','б','в','г','ґ','д','е','є','ж','з','и','і','ї','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ь','ю','я','А','Б','В','Г','Ґ','Д','Е','Є','Ж','З','И','І','Ї','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я']/,
        numbers = /^([0-9])+$/,
        dateNum = /^[0-9]+-[0-9]+-[0-9]+$/,
        name = $("#name"),
        age = $("#age"),
        date = $("#date").datepicker({
            dateFormat: 'dd-mm-yy',
            yearRange: '-100y:c+nn',
            firstDay: 1,
            changeYear: true,
            changeMonth: true,
            showMonthAfterYear: true,
            monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
            monthNamesShort: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
            dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота"],
            prevText: "Поперідній",
            nextText: "Наступний",
            currentText: "Сьогодні",
        }),
        allFields = $([]).add(name).add(age).add(date),
        tips = $(".validateTips");
    // Вивід всіх повідомлень
    function updateTips(t) {
        tips
            .html(t)
            .addClass("error-text");
        setTimeout(function () {
            tips.removeClass("error-text", 1500);
        }, 500);
    }
    // Провірка довжини
    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("error-input");
            if (n == "дата") {
                updateTips(`Не вірна довжина поля ${n}. Кількість символів ${max}.<br />Формат: дд-мм-рррр.`);
            } else {
                updateTips(`Поле ${n} повинно бути від ${min} до ${max} символів.`);
            }
            setTimeout(function () {
                o.removeClass("error-input", 1500);
            }, 2500);
            $('.ui-dialog').effect("shake", {
                times: 3
            }, 500);
            return false;
        } else {
            return true;
        }
    }
    // Провірка чи введені дозволені символи
    function checkAlphabet(o, alphabet, n) {
        if (!(alphabet.test(o.val()))) {
            o.addClass("error-input");
            $('.ui-dialog').effect("shake", {
                times: 3
            }, 500);
            updateTips(n);
            setTimeout(function () {
                o.removeClass("error-input", 1500);
            }, 2500);
            return false;
        } else {
            return true;
        }
    }
    // Провірка на дозволений вік
    function checkAge(a, n, min, max) {
        if (a.val() > max || a.val() < min) {
            a.addClass("error-input");
            updateTips(`Дозволений ${n} від ${min} до ${max}.`);
            setTimeout(function () {
                a.removeClass("error-input", 1500);
            }, 2500);
            $('.ui-dialog').effect("shake", {
                times: 3
            }, 500);
            return false;
        } else {
            return true;
        }
    }
    // Провірка чи введений вік і дата народження правельні відносно один одного
    function checkDateAge(a, d, text) {
        let nowDate = new Date;
        let userData = d.val().slice(6, 10);
        if (!(nowDate.getFullYear() - userData == a.val())) {
            a.addClass("error-input");
            d.addClass("error-input");
            $('.ui-dialog').effect("shake", {
                times: 3
            }, 500);
            updateTips(text);
            setTimeout(function () {
                a.removeClass("error-input", 1500);
                d.removeClass("error-input", 1500);
            }, 2500);
            return false;
        } else {
            return true;
        }
    }
    // Провірка всіх полів і додавання в таблицю
    function addUser() {
        let valid = true;
        allFields.removeClass("error-input");
        valid = valid && checkLength(name, "ім'я", 2, 16);
        valid = valid && checkLength(age, "вік", 1, 2);
        valid = valid && checkLength(date, "дата", 10, 10);
        valid = valid && checkAge(age, "вік", 1, 100);
        valid = valid && checkAlphabet(name, alphabet, "Дозволено тільки великі або малі букви українського алфавіту.");
        valid = valid && checkAlphabet(age, numbers, "Дозволяється тільки числа.");
        valid = valid && checkAlphabet(date, dateNum, "Дозволено тільки цифри. Приклад: дд-мм-рррр!!");
        valid = valid && checkDateAge(age, date, 'Ваш вік не відповідає вказаному році народження.');
        if (valid) {
            let uFirst = name.val().substr(0, 1).toUpperCase() + name.val().substr(1);
            $("#users tbody").append(`<tr><td>${uFirst}</td><td>${age.val()}</td><td>${date.val()}</td></tr>`);
            $('.ui-dialog').toggle("blind");
            dialog.dialog("close");
        }
        return valid;
    }
    // Налаштування діалового вікна
    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 380,
        width: 350,
        resizable: false,
        modal: true,
        title: "Новий користувач",
        closeOnEscape: true,
        hide: {
            effect: "explode",
            duration: 800
        },
        show: {
            effect: "blind",
            duration: 1000
        },
        buttons: {
            "Додати": addUser,
            "Відмінити": function () {
                $('.ui-dialog').toggle("blind");
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("error-input");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addUser();
    });

    $("#create-user").button().on("click", function () {
        dialog.dialog("open");
        tips.text(`Всі поля обов'язкові!`)
    });
});