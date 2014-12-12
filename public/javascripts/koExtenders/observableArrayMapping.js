//observableArrayMapping.js
define(['../knockout-3.2.0.debug.js'], function (ko) {
    ko.observableArray.fn.map = function (data, Constructor) {
        var mapped = ko.utils.arrayMap(data, function (item) {
            return new Constructor(item);
        });
        this(mapped);
        return this;
    }

    ko.observableArray.fn.mapPersons = function (data, Constructor) {
        var order = 1;
        var mapped = ko.utils.arrayMap(data, function (item) {
            return new Constructor(item, order++);
        });
        this(mapped);
        return this;
    }
});