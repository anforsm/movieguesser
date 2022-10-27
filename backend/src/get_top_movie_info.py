import json
from imdb import Cinemagoer
ia = Cinemagoer()


def main():
    # get_all_movies()
    # add_budget()
    check_all_movies()
    # get_attribute_for_movies(attribute)

    # def attribute():


manual_info = {
    "tt2584384": "$14,000,000",
    "tt11286314": "$75,000,000",
    "tt12361974": "$70,000,000",
    "tt6751668": "$11,400,000"
}


def check_all_movies():
    with open("shuffled_titles.json", "r") as f:
        allMovies = json.load(f)

    for movie in allMovies:
        if not 'budget' in movie:
            print(
                f"movie {movie['title']} {movie['imdbID']} does not have budget")
            #imdbmovie = ia.get_movie(movie["imdbID"].split("tt")[1])
            #ia.update(imdbmovie, "main")

            #budget = imdbmovie["box office"]["Budget"].split(" ")[0]
            movie["budget"] = manual_info[movie["imdbID"]]

    with open("shuffled_titles.json", "w") as f:
        f.write(json.dumps(allMovies))


def add_budget():
    with open("shuffled_titles.json", "r") as f:
        allMovies = json.load(f)

    i = 0
    for movie in allMovies:
        i += 1
        try:
            imdbmovie = ia.get_movie(movie["imdbID"].split("tt")[1])
            ia.update(imdbmovie, "main")
            print(
                f"Getting info for {imdbmovie.get('title')}, ({i}/{len(allMovies)})")

            try:
                budget = imdbmovie["box office"]["Budget"].split(" ")[0]
                print(f"Budget: {budget}")
                movie["budget"] = budget
            except:
                print(f"Failed to get budget")
        except:
            print(f"Failed to get movie {movie['title']}")

    with open("shuffled_titles.json", "w") as f:
        f.write(json.dumps(allMovies))


def get_all_movies():

    with open("titles_all_info.json", "r") as f:
        oldData = json.load(f)
        movie_infos = oldData

    with open("titles_and_info.json", "r") as f:
        data = json.load(f)
        i = len(movie_infos)
        for movie_data in data[len(oldData):]:
            i += 1
            movie = ia.get_movie(movie_data["imdbId"].split("tt")[1])
            ia.update(movie, "main")
            print(f"Getting info for {movie.get('title')}, ({i}/{len(data)})")

            try:
                movie_infos.append({
                    "imdbID": movie_data["imdbId"],
                    "title": movie.get("title"),
                    "year": movie.get("year"),
                    "quote": get_quote(movie),
                    "rating": movie.get("rating"),
                    "actors": get_actors(movie),
                    "writer": movie.get("writers")[0].get("name"),
                    "director": movie.get("directors")[0].get("name"),
                    "image": movie.get("cover url"),
                    "genres": movie.get("genres")[:3]
                })
            except:
                print("Failed")
                break
    with open("titles_all_info.json", "w") as f:
        f.write(json.dumps(movie_infos))


def get_actors(movie):
    top_actors = movie.get("cast")[:3]
    actor_info = []
    for actor in top_actors:
        ia.update(actor, info=["main"])

        actor_info.append({
            "name": actor.get("name"),
            "image": actor.get("headshot")
        })
    return actor_info


def get_quote(movie):
    ia.update(movie, "quotes")

    moviequote = ""
    # try to find appropriate quote for movie
    for quote in movie.get("quotes"):
        # if only one person talks in quote
        if len(quote) == 1:

            # strip away potential character name
            stripped_quote = ""
            foundColon = False
            for char in quote[0]:
                if char == ":" and not foundColon:
                    foundColon = True
                    stripped_quote = ""
                stripped_quote += char

            # remove ": " from quote
            moviequote = stripped_quote[2:]
            break
    if moviequote == "":
        print(f"Could not find quote for {movie.get('title')}")

    return moviequote


if __name__ == "__main__":
    main()
