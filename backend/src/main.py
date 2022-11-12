import json
import pandas as pd
import requests
import gzip
import shutil
import os
from firebase_admin import credentials, initialize_app, storage
from imdb import Cinemagoer
ia = Cinemagoer()


def main():
  file_manager = FileManager()
  movie = Movie("tt0032138").update_movie_from_apis()
  file_manager.replace_movie_images_with_firebase_url(movie)
  print(movie.poster)
  return

  top_ratings = file_manager.get_top_movies()
  for imdbID in top_ratings[1:2]:
    print("Getting info for", imdbID)
    if not file_manager.check_if_full_movie_info_exists(imdbID):
      movie = Movie(imdbID).update_movie_from_apis()
      file_manager.save_movie_to_file(movie)
      print("Saved movie to file")
    else:
      print("Movie already exists")
  


class FileManager:
  def __init__(self):
    pass

  def download_file(self, url, filename):
      with requests.get(url, stream=True) as r:
          r.raise_for_status()
          with open(filename, 'wb') as f:
              for chunk in r.iter_content(chunk_size=8192): 
                  f.write(chunk)

  def extract_gzip(self, filename):
      with gzip.open(filename, 'rb') as f_in:
          with open(filename[:-3], 'wb') as f_out:
              shutil.copyfileobj(f_in, f_out)
  
  def download_ratings_file(self):
    # download ratings data from https://datasets.imdbws.com/
    # ratings data url https://datasets.imdbws.com/title.ratings.tsv.gz

    ratings_url = "https://datasets.imdbws.com/title.ratings.tsv.gz"
    self.download_file(ratings_url, "../data/title.ratings.tsv.gz")
    self.extract_gzip("../data/title.ratings.tsv.gz")

    # remove gzip file
    os.remove("../data/title.ratings.tsv.gz")
  
  def download_titles_file(self):
    # download titles data from https://datasets.imdbws.com/
    # titles data url https://datasets.imdbws.com/title.basics.tsv.gz

    titles_url = "https://datasets.imdbws.com/title.basics.tsv.gz"
    self.download_file(titles_url, "../data/title.basics.tsv.gz")
    self.extract_gzip("../data/title.basics.tsv.gz")

    # remove gzip file
    os.remove("../data/title.basics.tsv.gz")

  def get_top_movies_from_file(self):
    with open("../data/top_movies_imdb_id.json", "r") as f:
      return json.loads(f.read())

  def get_top_movies(self):
    # check if top movies file already exists
    if os.path.exists("../data/top_movies_imdb_id.json"):
      return self.get_top_movies_from_file()


    # check if ratings file exists
    if not os.path.exists("../data/title.ratings.tsv"):
      self.download_ratings_file()
    # sort titles by number of votes
    ratings = pd.read_csv("../data/title.ratings.tsv", sep="\t")
    ratings.sort_values(by="numVotes", ascending=False, inplace=True)
    top_ratings = ratings["tconst"].iloc[:700]

    # check if titles file exists
    if not os.path.exists("../data/title.basics.tsv"):
      self.download_titles_file()
    # only keep movies
    titles = pd.read_csv("../data/title.basics.tsv", sep="\t")
    top_movies = titles[titles.tconst.isin(top_ratings)]
    top_movies = top_movies[top_movies.titleType == "movie"]
    top_movies = top_movies["tconst"]

    top_movies = list(top_movies)

    # save top movies as json file
    with open("../data/top_movies_imdb_id.json", "w") as f:
      f.write(json.dumps(top_movies))
    return top_movies

  def get_movies_from_file(self):
    with open("../data/movies_with_info.json", "r") as f:
      file_contents = f.read()
      print("file has")
      print(file_contents)
      # if file is empty return empty list
      if file_contents == "":
        print("empty file")
        return []

      return json.loads(file_contents)
  
  def check_if_full_movie_info_exists(self, imdbID):
    movies = self.get_movies_from_file()
    for movie in movies:
      movie = Movie.parse(movie)
      if movie.imdbID == imdbID:
        if not movie.verify_integrity():
          return False
        return True
    return False

  def save_movie_to_file(self, movie):
    current_movies = self.get_movies_from_file()

    with open("../data/movies_with_info.json", "w") as f:
      # check if movie with same imdbID already exists
      found_movie = False
      for i, current_movie in enumerate(current_movies):
        if current_movie["imdbID"] == movie.imdbID:
          current_movies[i] = movie.json()
          found_movie = True
          break
      
      if not found_movie:
        current_movies.append(movie.json())
      
      print("saving")
      print(json.dumps(current_movies))

      f.write(json.dumps(current_movies))

  def upload_file_to_firebase(self, firebase_path, filename):
    blob = BUCKET.blob(firebase_path)
    blob.upload_from_filename(filename)
    blob.make_public()
    return blob.public_url
  
  def download_image(self, path, image_url, imdbID):
    image_extension = image_url.split(".")[-1]
    downloaded_image = requests.get(image_url, stream=True)
    filename = f"{imdbID}.{image_extension}"
    full_path = f"../data/images/{path}"
    os.makedirs(full_path, exist_ok=True)
    with open(full_path + "/" + filename, "wb+") as f:
      f.write(downloaded_image.content)
    return full_path + "/" + filename, path + "/" + filename 
  
  def replace_movie_images_with_firebase_url(self, movie):
    full_path, relative_path = self.download_image("posters", movie.poster, movie.imdbID)
    movie.poster = self.upload_file_to_firebase(relative_path, full_path)

TRAKT_BASE_URL = "https://api.trakt.tv/"
TMDB_BASE_URL = "https://api.themoviedb.org/3/"
API_CONFIG = json.loads(open("api_config.json").read())
TRAKT_HEADERS = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": API_CONFIG["trakt"]["client_id"]
}
GOOGLE_CREDENTIALS = credentials.Certificate(API_CONFIG["google"])
initialize_app(GOOGLE_CREDENTIALS, {"storageBucket": "movieguesser-4997e.appspot.com"})
BUCKET = storage.bucket("movieguesser-4997e.appspot.com")

class Movie:
  def __init__(self, imdbID):
    self.imdbID = imdbID
    self.title = None
    self.poster = None
    self.backdrop = None
    self.year = None
    self.rating = None
    self.genres = None
    self.director = None
    self.writer = None
    self.budget = None
    self.quote = None
    self.actors = None
  
  @staticmethod
  def parse(json):
    movie = Movie(json["imdbID"])
    movie.title = json["title"]
    movie.poster = json["poster"]
    movie.backdrop = json["backdrop"]
    movie.year = json["year"]
    movie.rating = json["rating"]
    movie.genres = json["genres"]
    movie.director = json["director"]
    movie.writer = json["writer"]
    movie.budget = json["budget"]
    movie.quote = json["quote"]
    movie.actors = json["actors"]
    return movie

  def verify_integrity(self):
    def verify_property(prop, name):
      if prop is None:
        raise Exception(f"Property {name} is None")
      if prop == "N/A":
        raise Exception(f"Property {name} is N/A")
      if prop == "":
        raise Exception(f"Property {name} is empty string")
      if prop == []:
        raise Exception(f"Property {name} is empty list")
      if prop == {}:
        raise Exception(f"Property {name} is empty dict")
      if prop == 0:
        raise Exception(f"Property {name} is 0")
      if prop == 0.0:
        raise Exception(f"Property {name} is 0.0")
      if prop == "NaN":
        raise Exception(f"Property {name} is NaN")

    try:
      verify_property(self.title, "title")
      verify_property(self.poster, "poster")
      verify_property(self.backdrop, "backdrop")
      verify_property(self.year, "year")
      verify_property(self.rating, "rating")
      verify_property(self.genres, "genres")
      verify_property(self.director, "director")
      verify_property(self.writer, "writer")
      verify_property(self.budget, "budget")
      verify_property(self.quote, "quote")
      verify_property(self.actors, "actors")

    except Exception as e:
      print("Error verifying integrity of movie " + self.imdbID)
      print(e)
      return False

  def update_movie_from_apis(self):
    self.get_movie_info()
    self.update_movie_info()
    return self

  def get_movie_info(self):
    self.get_trakt_info()
    self.get_tmdb_info()
    self.get_imdb_info()
  
  def get_trakt_info(self):
    self._trakt_movie_info = requests.get(
      TRAKT_BASE_URL + "movies/" + self.imdbID,
      headers=TRAKT_HEADERS
    ).json()

    self._trakt_actor_info = requests.get(
      TRAKT_BASE_URL + "movies/" + self.imdbID + "/people",
      headers=TRAKT_HEADERS
    ).json()["cast"][:5]
  
  def get_tmdb_info(self):
    self._tmdb_movie_info = requests.get(
      TMDB_BASE_URL + "movie/" + self.imdbID,
      params={
        "api_key": API_CONFIG["tmdb"]["api_key"]
      }
    ).json()
  
  def get_imdb_info(self):
    self._cinemagoer_movie = ia.get_movie(self.imdbID.split("tt")[1])
    ia.update(self._cinemagoer_movie, info=["main", "quotes"])

  def update_movie_info(self):
    self.get_title()
    self.get_poster()
    self.get_backdrop()
    self.get_year()
    self.get_rating()
    self.get_genres()
    self.get_director()
    self.get_writer()
    self.get_budget()
    self.get_quote()
    self.get_actors()

  def get_title(self):
    self.title = self._trakt_movie_info["title"]
  
  def get_poster(self):
    self.poster = "https://image.tmdb.org/t/p/w780" + self._tmdb_movie_info["poster_path"]
  
  def get_backdrop(self):
    self.backdrop = "https://image.tmdb.org/t/p/w1280" + self._tmdb_movie_info["backdrop_path"]
  
  def get_year(self):
    self.year = self._trakt_movie_info["year"]
  
  def get_rating(self):
    self.rating = self._cinemagoer_movie["rating"]
  
  def get_genres(self):
    self.genres = self._cinemagoer_movie["genres"][:3]
  
  def get_director(self):
    self.director = self._cinemagoer_movie["director"][0]["name"]
  
  def get_writer(self):
    self.writer = self._cinemagoer_movie["writer"][0]["name"]

  def get_budget(self):
    self.budget = self._cinemagoer_movie["box office"]["Budget"].split(" ")[0]
  
  def get_quote(self):
    for quote in self._cinemagoer_movie["quotes"]:
      # only get monologue quotes
      if len(quote) != 1:
        continue

      # remove character name from quote
      self.quote = ":".join(quote[0].split(":")[1:])

      # break after first quote is found
      break

  def get_actors(self):
    # get actor
    self.actors = [{
      "name": actor["person"]["name"],
      "tmdbID": actor["person"]["ids"]["tmdb"],
      "imdbID": actor["person"]["ids"]["imdb"]
      } for actor in self._trakt_actor_info]

    # get actor images
    for actor in self.actors:
      actor["image"] = "https://image.tmdb.org/t/p/w500" + requests.get(
        TMDB_BASE_URL + "person/" + str(actor["tmdbID"]),
        params={
          "api_key": API_CONFIG["tmdb"]["api_key"]
        }
      ).json()["profile_path"]

    # remove tmdbID
    for actor in self.actors:
      del actor["tmdbID"]
      
  def __str__(self):
    return f"""
    IMDB ID: {self.imdbID}
    Title: {self.title}
    Poster: {self.poster}
    Backdrop: {self.backdrop}
    Year: {self.year}
    Rating: {self.rating}
    Genres: {self.genres}
    Director: {self.director}
    Writer: {self.writer}
    Budget: {self.budget}
    Quote: {self.quote}
    Actors: {self.actors}
    """
  
  def json(self):
    return {
      "imdbID": self.imdbID,
      "title": self.title,
      "poster": self.poster,
      "backdrop": self.backdrop,
      "year": self.year,
      "rating": self.rating,
      "genres": self.genres,
      "director": self.director,
      "writer": self.writer,
      "budget": self.budget,
      "quote": self.quote,
      "actors": self.actors
    }
    

if __name__ == "__main__":
  main()