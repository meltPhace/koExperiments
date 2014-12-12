//observableValidation.js
define(['../knockout-3.2.0.debug.js'], function (ko) {
    ko.observable.fn.maxLengthWithMessage = function (max, message) {
        this.hasMaxLengthError = ko.observable();
        this.maxLengthMsg = message || "No more than " + max + " characters";

        this.subscribe(function (newValue) {
            this.hasMaxLengthError(newValue && newValue.length > max);
        }, this);

        this.valueHasMutated();
        return this;
    }

    ko.observable.fn.maxLengthWithoutMessage = function (max) {
        this.subscribe(function (newValue) {
            if(newValue && newValue.length > max){
                this(newValue.substring(0, newValue.length - 1));
            }
        }, this);

        this.valueHasMutated();
        return this;
    }

    ko.observable.fn.numberOnly = function (message) {
        this.hasNumberOnlyError = ko.observable();
        this.numberOnlyMsg = message || "numbers only!";

        this.subscribe(function (newValue) {
            if(newValue){
                var numberNewValue = new Number(newValue);
                this.hasNumberOnlyError(isNaN(numberNewValue));
            }
            else this.hasNumberOnlyError(false);
        }, this);

        this.valueHasMutated();
        return this;
    }

    ko.observable.fn.required = function (message) {
        this.hasRequiredError = ko.observable();
        this.requiredMsg = message || "this is required!";

        this.subscribe(function (newValue) {
            if(newValue){
                this.hasRequiredError(newValue.length < 1);
            }
            else this.hasRequiredError(true);
        }, this);

        this.valueHasMutated();
        return this;
    }
});
