var movieApp = movieApp || {};

(function(){


	// $ content object.
	movieApp.content = {

		about: {
			pageTitle: "About this app",
			descriptions: [
				{description: "This single-page application is made during the Frontend 2 course for my study. It is written in Object Oriented Javascript and uses the MVC pattern. It uses the movies API from Dennis Tel. The data is stored locally using HTML5 localStorage."},
				{description: "The app is written in vanilla JavaScript and a couple of plug-ins. These plug-ins are routie.js to create the router, and transparency as templating engine. Its styling is written with LESS."},
				{description: "Ipsa quasi minima enim ut, dolor dolores rem commodi, id quo quam nam."},
			]
		},

		movies: {
			pageTitle: "Favorite movies",
			myMovies: []
		},

		directives: {
			myMovies:{
				movieCover: {
					src: function() { return this.cover; }
				},

				details: {
					href: function() { return "#/movies/" + this.id; }
				}
			}
		}
	};


	// $ 3.0: ajax object.
	movieApp.ajax = {

		getData: function (type, url, success) {
      if (false && localStorage.getItem('movieAppData')){
				movieApp.localService.init();
      }

      else {
				var req = new XMLHttpRequest();
					req.onreadystatechange = function() {
						if (req.readyState === 4) {
							if (req.status === 200 || req.status === 201) {
								success(JSON.parse(req.responseText));
							}
						}

						else {
							//loading.
							console.log("loading");
						}
					};

				req.open(type, url, true);
				req.setRequestHeader('Content-type','application/json');
				req.send(null);
			}
		}
	};


	// $ 3.1 local storage object.
	movieApp.localService = {

		init: function(){
			var localMovies = JSON.parse(localStorage.getItem('movieAppData'));
			for (var i = 0; i < localMovies.length; i++){
				movieApp.content.movies.myMovies.push(localMovies[i]);
			}
			console.log(movieApp.content.movies.myMovies, 'gettingg it local babyyy');
			Transparency.render(document.querySelector("[data-route='movies']"), movieApp.content.movies, movieApp.content.directives);
		}
	};


	// $ 2.0: controller object.
	movieApp.controller = {

		init: function(){
			movieApp.router.init();
			movieApp.sections.init();
		}
	};


	// $ 4.0: router object.
	movieApp.router = {

		init: function(){
			routie({
				'/about': function() {
					console.log("about");
					movieApp.sections.toggle("[data-route='about']");
				},

				'/movies': function() {
					console.log("movies");
					movieApp.sections.toggle("[data-route='movies']");
				},

				'/movies/:id': function(id) {
					console.log("specific movie");
					movieApp.sections.movie(id);
					movieApp.sections.toggle("[data-route='movie']");
				},

				'*': function(){
					console.log("default");
					movieApp.sections.toggle("[data-route='about']");
				}
			});
		}
	};


	// $ 5.0: sections object.
	movieApp.sections = {

		init: function(){
			this.about();
			this.movies();
		},

		about: function(){
			Transparency.render(document.querySelector("[data-route='about']"), movieApp.content.about);
		},

		movies: function(){
			var self = this;
			document.querySelector(".loading").classList.add('is-active');
			movieApp.ajax.getData('GET', "http://dennistel.nl/movies/", self.moviesFetched);
		},

			moviesFetched: function(movies){
				for (var i = 0; i < movies.length; i++){
					movieApp.content.movies.myMovies.push(movies[i]);
				}
				console.log(movieApp.content.movies.myMovies, 'gettingg it from the server babyyy');
				localStorage.setItem('movieAppData', JSON.stringify(movieApp.content.movies.myMovies));
				movieApp.sections.combineReviews();
				Transparency.render(document.querySelector("[data-route='movies']"), movieApp.content.movies, movieApp.content.directives);
				setTimeout(function(){document.querySelector(".loading").classList.remove('is-active');}, 3000);
			},

		combineReviews: function(){

				_.map(movieApp.content.movies.myMovies, function (movie, i){
					movie.reviews   = _.reduce(movie.reviews,   function(memo, review){   return memo + review.score; }, 0) / movie.reviews.length;
					// movie.directors = _.reduce(movie.directors, function(memo, director){ return memo + director.name + ' '; }, '');
					// movie.actors    = _.reduce(movie.actors,    function(memo, actor){    return memo + actor.actor_name + ', ';}, '');
					return movie;
				});

		},

		movie: function(id){
			Transparency.render(document.querySelector("[data-route='movie']"), movieApp.content.movies.myMovies[id-1], movieApp.content.directives);

			var movieDetails = document.querySelector("[data-route='movie']");
			var mc = new Hammer(movieDetails);
			mc.on("swipeleft swiperight", function() {
				console.log("Can swipe this! oh-oh oh oh oh-oh-oh!");
				movieApp.sections.toggle("[data-route='movies']");
			});
		},

		toggle: function(section){
			var sections = document.querySelectorAll('[data-route]');
			for (i = 0; i < sections.length; i++){
				sections[i].classList.remove('is-active');
			}
			document.querySelector(section).classList.add('is-active');
		}
	};


	// $ 1.0: initialize the app.
	movieApp.controller.init();


})(); // end self invoking anonymous function.