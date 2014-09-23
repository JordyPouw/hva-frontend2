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
				},
				'/movies': function() {
					console.log("movies");
				}
			});
		}
	};


	// $ sections object.
	movieApp.sections = {

		init: function(){
			movieApp.sections.about();
			movieApp.sections.movies();
		},

		about: function(){
			Transparency.render(document.getElementById('about'), movieApp.content.about);
		},

		movies: function(){
			Transparency.render(document.getElementById('movies'), movieApp.content.movies, movieApp.content.directives);
		}
	};


	// $ dom ready.
	document.addEventListener("DOMContentLoaded", function() {
		movieApp.controller.init();
	});


})(); // end self invoking anonymous function.