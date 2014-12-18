define(['../knockout-3.2.0.debug.js', '../koExtenders/observableValidation.js'], function (ko) {
    var Person = function (data, orderNum) {
        this.username = ko.observable(data.username)
            .maxLengthWithMessage(20)
            .required();

        this.age = ko.observable(data.age)
            .numberOnly()
            .maxLengthWithoutMessage(3);

        this.role = ko.observable(data.role || "Peasant");
        this.order = ko.observable(data.order || orderNum);
    };
    return Person;
});