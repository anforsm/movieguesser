blur_movie_poster.py contains some functions that blur movie posters.

scramble_titles.py scramble the movie titles from titles_all_info.json and save them to shuffled_titles.json.

get_top_movies.py gets the most popular movies from IMDB and saves them to titles.json (only title of movie) and titles_and_info.json (title and IMDB ID).

get_top_movie_info.py uses IMDB scraper to get movie info, somewhat outdated.

trakt_get_movie_info uses the Trakt API to get movie info (especially images), more up to date, everything should be using this API in the future. Also uploads the images to Google Cloud.
