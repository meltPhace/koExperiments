//testKnockoutVM.js
require(['./javascripts/knockout-3.2.0.debug.js', './javascripts/ajaxhelpers/ajaxGet.js', './javascripts/koExtenders/observableValidation.js', './javascripts/koExtenders/observableArrayMapping.js','./javascripts/domready.js'], 
    function (ko, ajaxGet) {
    var personsFromServer = [];

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

    //--------------------Main ViewModel-----------------------//
    var ViewModel = function () {
        this.getPersonsFromServer()
        this.persons = ko.observableArray();
        this.selectedPerson = ko.observable(this.persons()[0]);
        this.availableRoles = ko.observableArray(["Samurai", "Ninja", "Daimyo", "Peasant"]);

        //filters
        this.textFilter = ko.observable("");
        this.roleFilter = ko.observable("all");
        this.availableRoleFilters = ko.observableArray(["all", "Samurai", "Ninja", "Daimyo", "Peasant"]);

        //pager variables
        this.pageIndex = ko.observable(0);
        this.pageSize = ko.observable(8);
        this.pageSizeOptions = [8, 10, 15, 20, 30];

        //computed
        this.roleFilteredPersons = ko.computed(function () {
            var filter = this.roleFilter();
            if(filter == 'all'){
                return this.persons();
            }else{
                this.pageIndex(0);
                return ko.utils.arrayFilter(this.persons(), function (item) {
                    return item.role().toLowerCase() == filter.toLowerCase();
                })
            }
        }, this);

        this.personsFilteredByText = ko.computed(function () {
            var filter = this.textFilter().toLowerCase();
            if(!filter){
                return this.roleFilteredPersons();
            }else{
                this.pageIndex(0);
                return ko.utils.arrayFilter(this.roleFilteredPersons(), function (item) {
                    return item.username().toLowerCase().indexOf(filter) !== -1;
                });
            }
        }, this);

        this.maxPageIndex = ko.computed(function () {
            return Math.ceil(this.personsFilteredByText().length / this.pageSize()) - 1;
        }, this);

        this.pageIndexDisplay = ko.computed(function () {
            return ((this.pageIndex() + 1) + '/' + (this.maxPageIndex() + 1));
        }, this);        

        this.pagedFilteredPersons = ko.computed(function () {
            var begin = this.pageIndex() * this.pageSize();
            var end = begin + this.pageSize();
            return this.personsFilteredByText().slice(begin, end);
        }, this);

        //manual subscriptions
        this.pageSize.subscribe(function(value) {
            this.pageIndex(0);
        }, this);

        //functions bindings
        //person
        this.selectPerson = this.selectPerson.bind(this);
        this.addPerson = this.addPerson.bind(this);
        this.removePerson = this.removePerson.bind(this);
        //pager
        this.firstPage = this.firstPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        //loading
        this.getPersonsFromServer = this.getPersonsFromServer.bind(this);
    };

    //--------------------ViewModel prototypes-----------------------//
    ViewModel.prototype.selectPerson = function(value) {
        this.selectedPerson(value);
    };

    ViewModel.prototype.addPerson = function() {
        this.selectedPerson(new Person({ username: "", age: 0, order: this.persons().length + 1 }));
        this.persons.push(this.selectedPerson());
    };

    ViewModel.prototype.removePerson = function() {
        var value = this.selectedPerson();
        if(value != null){
            if(window.confirm('Sure about that?')){
                this.persons.remove(this.selectedPerson());
                this.selectedPerson(null);
            }
        }else window.alert('Please select a person before trying to remove it');
    };

    ViewModel.prototype.firstPage = function () {
        this.pageIndex(0);
    };

    ViewModel.prototype.previousPage = function () {
        if(this.pageIndex() >= 1){
            this.pageIndex(this.pageIndex() - 1);
        }
    };

    ViewModel.prototype.nextPage = function () {
        if(this.pageIndex() < this.maxPageIndex()){
            this.pageIndex(this.pageIndex() + 1);
        }
    };

    ViewModel.prototype.lastPage = function () {
        this.pageIndex(this.maxPageIndex());
    };

    ViewModel.prototype.getPersonsFromServer = function() {
        var thus = this;
        ajaxGet('/getpersons').then(function (res) {
            personsFromServer = JSON.parse(res);
            var order = 1;
            var mapped = ko.utils.arrayMap(personsFromServer, function (item) {
                return new Person(item, order++);
            });
            thus.persons(mapped);
        }, function (error) {
            console.error(error);
        });
    };
    
    var mainViewModel = new ViewModel();
    ko.applyBindings(mainViewModel);
});
