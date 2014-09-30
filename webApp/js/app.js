var movieApp = movieApp || {};

(function(){


	// $ content object.
	movieApp.content = {

		about: {
			pageTitle: "About this app",
			descriptions: [
				{description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit, quidem."},
				{description: "Magnam voluptate quae incidunt, harum officia laboriosam praesentium."},
				{description: "Ipsa quasi minima enim ut, dolor dolores rem commodi, id quo quam nam."},
			]
		},

		movies: {
			pageTitle: "Favorite movies",
			myMovies: [
				{ title: "Shawshank Redemption", releaseDate: "14 October 1994", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", link: "img/shawshank-redemption.jpg" },
				{ title: "The Godfather", releaseDate: "24 March 1972", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", link: "img/the-godfather.jpg" },
				{ title: "Pulp Fiction", releaseDate: "14 October 1994", description: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", link: "img/pulp-fiction.jpg" },
				{ title: "The Dark Knight", releaseDate: "18 July 2008", description: "When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.", link: "img/the-dark-knight.jpg" }
			]
		},

		directives: {
			myMovies:{
				cover: {
					src: function() { return this.link; }
				}
			}
		}
	};


	// $ controller object.
	movieApp.controller = {

		init: function(){
			movieApp.ajax.getData();
			movieApp.router.init();
			movieApp.sections.init();
		}
	};


	// $ router object.
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
				}
			});
		}
	};


	// $ ajax object.
	movieApp.ajax = {

		getData: function () {
			var req = new XMLHttpRequest();
			req.open('GET', 'http://dennistel.nl/movies', true);
			req.setRequestHeader('Content-type','application/json');

			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					if (req.status === 200 || req.status === 201) {
						var movies = JSON.parse(req.responseText);
						console.log(movies);
            for (var i = movies.length - 1; i >= 0; i--){
							movieApp.content.movies.myMovies.push(movies[i]);
            }
            console.log(movieApp.content.movies);
					}
				}
				else {
					//fail.
				}
			};
			req.send(null);
		}
	};


	// $ sections object.
	movieApp.sections = {

		init: function(){
			this.about();
			this.movies();
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


	// $ initialize the app.
	movieApp.controller.init();


})(); // end self invoking anonymous function.