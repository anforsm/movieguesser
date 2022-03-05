import json
import random


with open("titles_all_info.json", "r") as f:
  titles = json.load(f)
  random.shuffle(titles)

with open("shuffled_titles.json", "w") as f:
  f.write(json.dumps(titles))
