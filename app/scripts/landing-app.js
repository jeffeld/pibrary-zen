var landingApp = angular.module("LandingApp", [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'LandingControllers'
]);

var landingControllers = angular.module('LandingControllers', []);

landingControllers.controller('LandingController', ['$scope', '$timeout',
  function ($scope, $timeout) {
    var quotes = [
        {
          quote: "In a good bookroom you feel in some mysterious way that you are absorbing the wisdom contained in all the books through your skin, without even opening them.",
          who: "Mark Twain"
        },
        {
          quote: "Whatever the cost of our libraries, the price is cheap compared to that of an ignorant nation.",
          who: "Walter Cronkite"
        },
        {
          quote: "So big it doesn't need a name. It's just The Library",
          who: "The Doctor"
        },
        {
          quote: "Libraries were full of ideas–perhaps the most dangerous and powerful of all weapons.",
          who: "Sarah J. Maas"
        }
      ],
      delay = 10000,
      nq = 0,
      cycleQuote = function () {
        nq++;
        $scope.Quote = quotes[nq % quotes.length];
        $('#bq').addClass('bq');
        $timeout(cycleQuote, delay);
      };


    $scope.Quote = quotes[0];
    quotes = _.shuffle(quotes);
    $timeout(function () {
      $timeout(cycleQuote, delay);
    }, delay / 2);


    $scope.Backgrounds = [
      'cover1', 'cover2', 'cover3'
    ];

    var backgroundClasses = ['bg1', 'bg2', 'bg3'],
      bi = _.random(0, (backgroundClasses.length - 1)),
      bgt = 6000;

    var cycleBackground = function () {

      $('html').removeClass(backgroundClasses[bi]);
      bi++;
      bi = bi % backgroundClasses.length;
      $('html').addClass(backgroundClasses[bi]);

      $timeout(cycleBackground, bgt);

    };

    cycleBackground();
  }
]);
