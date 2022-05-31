from PIL import Image, ImageFilter


def main():
    #image = Image.open("test/tt1951264.jpg", "r")
    # green = 10
    # yellow = 20
    #image = image.filter(ImageFilter.GaussianBlur(radius=20))
    # image.show()
    create_blurred_versions("tt1843866")


def create_blurred_versions(imdbID):
    poster1path = f"posters_medium_blur/{imdbID}_medium_blur.jpg"
    poster2path = f"posters_large_blur/{imdbID}_large_blur.jpg"
    blur_image(Image.open(f"posters/{imdbID}.jpg", "r"),
               "medium").save(poster1path)
    blur_image(Image.open(f"posters/{imdbID}.jpg", "r"),
               "large").save(poster2path)
    return poster1path, poster2path


def blur_image(image, level):
    if level == "large":
        return image.filter(ImageFilter.GaussianBlur(radius=25))
    elif level == "medium":
        return image.filter(ImageFilter.GaussianBlur(radius=15))


if __name__ == "__main__":
    main()
