import shutil
import requests
import json
from firebase_admin import credentials, initialize_app, storage
from os.path import exists
from backend.blur_movie_poster import create_blurred_versions


TRAKT_BASE_URL = "https://api.trakt.tv/"
TMDB_BASE_URL = "https://api.themoviedb.org/3/"
apiConfig = json.loads(open("apiConfig.json", "r").read())
api_headers = {
    "Content-type": "application/json",
    "trakt-api-key": apiConfig["trakt"]["clientID"],
    "trakt-api-version": "2"
}

cred = credentials.Certificate(apiConfig["google"])
initialize_app(cred, {"storageBucket": "movieguesser-4997e.appspot.com"})
bucket = storage.bucket("movieguesser-4997e.appspot.com")


# check there will be blood and matrix revolutions

def main():
    with open("shuffled_titles.json", "r") as f:
        allMovies = json.load(f)
    for movie in allMovies:
        if movie["imdbID"] == "tt1843866":
            poster_medium_path, poster_large_path = create_blurred_versions(
                movie["imdbID"])
            print(upload_image(poster_medium_path))
            print(upload_image(poster_large_path))


def get_actor_backdrop_poster():
    with open("shuffled_titles.json", "r") as f:
        allMovies = json.load(f)
    i = 0
    for movie in allMovies:
        print(f"{movie['title']}: {i}/{len(allMovies)}")
        print()
        i += 1
        # if (exists("posters/"+movie["imdbID"]+".jpg")):
        # continue
        imdbID = movie["imdbID"]
        poster, backdrop, actors = update_actors_poster_backdrop(imdbID)
        movie["poster"] = poster
        movie["backdrop"] = backdrop
        movie["actors"] = actors
        del movie["image"]
    with open("shuffled_titles.json", "w") as f:
        f.write(json.dumps(allMovies))


def update_actors_poster_backdrop(imdbID):
    images = get_images_for_movie(imdbID)

    poster = images["poster"]
    backdrop = images["backdrop"]
    actors = images["actors"]

    new_actors = []
    for actor in actors:
        if not actor["image"] == "":
            filename = download_image_actor(actor)
            image_url = upload_image(f"actors/{filename}")
        else:
            image_url = ""
        new_actors.append({
            "name": actor["name"],
            "imdbID": actor["imdbID"],
            "image": image_url,
        })

    new_poster = upload_image(
        "posters/" + download_image("posters", poster, imdbID))
    new_backdrop = upload_image(
        "backdrops/" + download_image("backdrops", backdrop, imdbID))

    return new_poster, new_backdrop, new_actors


def upload_image(image):
    blob = bucket.blob(image)
    blob.upload_from_filename(image)
    blob.make_public()
    return blob.public_url


def download_image(path, image_url, imdbID):
    image_extension = image_url.split('.')[-1]
    res = requests.get(image_url, stream=True)
    filename = f"{imdbID}.{image_extension}"
    with open(f"{path}/{filename}", "wb") as f:
        shutil.copyfileobj(res.raw, f)
    return filename


def download_image_actor(actor):
    image_url = actor["image"]
    image_extension = image_url.split('.')[-1]
    res = requests.get(image_url, stream=True)
    filename = f"{actor['imdbID']}.{image_extension}"
    with open(f"actors/{filename}", "wb") as f:
        shutil.copyfileobj(res.raw, f)
    return filename


def get_images_for_movie(imdbID):
    cast = get_cast(imdbID)
    actors = [{
        "name": cast["name"],
        "imdbID": cast["imdbID"],
        "image": get_cast_image(cast["tmdbID"])
    } for cast in get_cast(imdbID)]

    poster, backdrop = get_movie_poster_and_backdrop(imdbID)

    return {
        "poster": poster,
        "backdrop": backdrop,
        "actors": actors
    }


def get_movie_poster_and_backdrop(imdbID):
    tmdbID = get_movie_info(imdbID)["ids"]["tmdb"]
    movieInfo = requests.get(f"{TMDB_BASE_URL}movie/{tmdbID}",
                             params={"api_key": apiConfig["tmdb"]["apiKey"]}).json()
    poster = "https://image.tmdb.org/t/p/w780" + movieInfo["poster_path"]
    backdrop = "https://image.tmdb.org/t/p/w1280" + movieInfo["backdrop_path"]
    return poster, backdrop


def get_movie_info(imdbID):
    movie = requests.get(f"{TRAKT_BASE_URL}movies/{imdbID}",
                         headers=api_headers,
                         params={
                             "extended": "full"
                         }).json()
    return movie


def get_cast(imdbID):
    cast = requests.get(f"{TRAKT_BASE_URL}movies/{imdbID}/people",
                        headers=api_headers).json()["cast"][:3]
    actors = [{
        "name": character["person"]["name"],
        "tmdbID": character["person"]["ids"]["tmdb"],
        "imdbID": character["person"]["ids"]["imdb"]
    } for character in cast]
    return actors


def get_cast_image(tmdbID):
    person_info = requests.get(
        f"{TMDB_BASE_URL}person/{tmdbID}", params={"api_key": apiConfig["tmdb"]["apiKey"]}).json()
    if person_info["profile_path"] is None:
        print("could not find image for ", tmdbID)
        return ""
    image = "https://image.tmdb.org/t/p/w500" + person_info["profile_path"]
    return image


if __name__ == "__main__":
    main()
