import json
import pandas as pd

ratings = pd.read_csv("title.ratings.tsv", sep="\t")
ratings.sort_values(by="numVotes", ascending=False, inplace=True)

# get movie ids of top ratings
top_ratings = ratings["tconst"].iloc[:500]

titles = pd.read_csv("title.basics.tsv", sep="\t")

# get top movie titles
top_titles = titles[titles.tconst.isin(top_ratings)]
top_titles = top_titles[top_titles.titleType == "movie"]
top_titles = top_titles[["tconst", "primaryTitle"]]

print(top_titles)
formatted_titles = []
only_titles = []
for i, title in top_titles.iterrows():
  formatted_titles.append({
    "imdbId": title.tconst,
    "title": title.primaryTitle
  })
  only_titles.append(title.primaryTitle)

with open("titles.json", "w") as f:
  f.write(json.dumps(only_titles))

with open("titles_and_info.json", "w") as f:
  f.write(json.dumps(formatted_titles))
