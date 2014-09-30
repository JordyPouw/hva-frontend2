var movieApp = movieApp || {};

(function(){


	// $ content object.
	movieApp.content = {

		about: {
			pageTitle: "About this app",
			descriptions: [
				{description: "This single-page application is made during the Frontend 2 course for my study. It is written in Object Oriented Javascript and uses the MVC pattern. It uses the movies API from Dennis Tel."},
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
				genre: {
					text: function() { return this.value; }
				}
			}
		}
	};


	// $ 2: controller object.
	movieApp.controller = {

		init: function(){
			movieApp.ajax.getData();
			movieApp.router.init();
			movieApp.sections.init();
		}
	};


	// $ 3.1: router object.
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

				'*': function(){
					console.log("default");
					movieApp.sections.toggle("[data-route='about']");
				}
			});
		}
	};


	// $ 3.0: ajax object.
	movieApp.ajax = {

		getData: function () {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					if (req.status === 200 || req.status === 201) {
						var movies = JSON.parse(req.responseText);
            for (var i = 0; i < movies.length; i++){
							movieApp.content.movies.myMovies.push(movies[i]);
            }
            console.log(movieApp.content.movies);
            movieApp.sections.movies();
					}
				}
				else {
					//fail.
				}
			};

			req.open('GET', 'http://dennistel.nl/movies', true);
			req.setRequestHeader('Content-type','application/json');
			req.send(null);
		}
	};


	// $ 3.2: sections object.
	movieApp.sections = {

		init: function(){
			this.about();
		},

		about: function(){
			Transparency.render(document.querySelector("[data-route='about']"), movieApp.content.about);
		},

		movies: function(){
			Transparency.render(document.querySelector("[data-route='movies']"), movieApp.content.movies, movieApp.content.directives);
		},

		toggle: function(section){
			var sections = document.querySelectorAll('[data-route]');
			for (i = 0; i < sections.length; i++){
				sections[i].classList.remove('is-active');
			}
			document.querySelector(section).classList.add('is-active');
		}
	};


	// $ 1: initialize the app.
	movieApp.controller.init();


})(); // end self invoking anonymous function.