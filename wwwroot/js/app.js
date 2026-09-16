var app = angular.module('dotActivApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController'
        })
        .when('/dashboard', {
            templateUrl: 'pages/dashboard.html',
            controller: 'DashboardController'
        })
        .otherwise({
            redirectTo: '/login'
        });
});

app.factory('AuthService', function () {
    return {
        getUser: function () {
            var data = localStorage.getItem('currentUser');
            return data ? JSON.parse(data) : null;
        },
        setUser: function (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        },
        clearUser: function () {
            localStorage.removeItem('currentUser');
        },
        isLoggedIn: function () {
            return this.getUser() !== null;
        }
    };
});

app.controller('LoginController', function ($scope, $http, $location, AuthService) {
    if (AuthService.isLoggedIn()) {
        $location.path('/dashboard');
    }

    $scope.credentials = { username: '', password: '' };
    $scope.errorMessage = '';
    $scope.isLoading = false;

    $scope.submitLogin = function () {
        $scope.errorMessage = '';
        $scope.isLoading = true;

        $http.post('/api/auth/login', $scope.credentials)
            .then(function (response) {
                $scope.isLoading = false;
                AuthService.setUser(response.data);
                $location.path('/dashboard');
            })
            .catch(function (error) {
                $scope.isLoading = false;
                if (error.data && error.data.message) {
                    $scope.errorMessage = error.data.message;
                } else {
                    $scope.errorMessage = 'Unable to log in. Please verify your credentials.';
                }
            });
    };
});

app.controller('DashboardController', function ($scope, $http, $location, AuthService) {
    var user = AuthService.getUser();
    if (!user) {
        $location.path('/login');
        return;
    }

    $scope.currentUser = user;
    $scope.stores = [];
    $scope.divisions = [];
    $scope.provinces = [];
    $scope.isLoading = true;
    $scope.errorMessage = '';

    $scope.searchTerm = '';
    $scope.selectedDivision = '';
    $scope.selectedProvince = '';
    $scope.sortColumn = 'sStoreName';
    $scope.reverseSort = false;

    $scope.loadStores = function () {
        $scope.isLoading = true;
        $http.get('/api/stores', {
            headers: { 'X-User-Id': user.userId }
        })
            .then(function (response) {
                $scope.isLoading = false;
                $scope.stores = response.data;

                var divSet = new Set();
                var provSet = new Set();

                $scope.stores.forEach(function (s) {
                    if (s.sDivision) divSet.add(s.sDivision);
                    if (s.sProvince) provSet.add(s.sProvince);
                });

                $scope.divisions = Array.from(divSet).sort();
                $scope.provinces = Array.from(provSet).sort();
            })
            .catch(function (error) {
                $scope.isLoading = false;
                $scope.errorMessage = 'Failed to load store records.';
            });
    };

    $scope.sortBy = function (column) {
        if ($scope.sortColumn === column) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortColumn = column;
            $scope.reverseSort = false;
        }
    };

    $scope.customFilter = function (store) {
        var matchesDivision = !$scope.selectedDivision || store.sDivision === $scope.selectedDivision;
        var matchesProvince = !$scope.selectedProvince || store.sProvince === $scope.selectedProvince;

        var matchesSearch = true;
        if ($scope.searchTerm) {
            var term = $scope.searchTerm.toLowerCase();
            matchesSearch = (store.sStoreName && store.sStoreName.toLowerCase().indexOf(term) !== -1) ||
                (store.sStoreCode && store.sStoreCode.toLowerCase().indexOf(term) !== -1) ||
                (store.sDivision && store.sDivision.toLowerCase().indexOf(term) !== -1) ||
                (store.sProvince && store.sProvince.toLowerCase().indexOf(term) !== -1);
        }

        return matchesDivision && matchesProvince && matchesSearch;
    };

    $scope.logout = function () {
        AuthService.clearUser();
        $location.path('/login');
    };

    $scope.loadStores();
});

app.run(function ($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next && next.templateUrl === 'pages/dashboard.html') {
            if (!AuthService.isLoggedIn()) {
                event.preventDefault();
                $location.path('/login');
            }
        }
    });
});