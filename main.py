import eel
from pytube import YouTube
from os import system
from getpass import getuser
from platform import system


@eel.expose
def search_link_fromYT(entry: str):
    global objectYT
    entry = str(entry)
    try:
        objectYT = YouTube(entry)
        return {"title": objectYT.title, "author": objectYT.author}
    except:
        return None


@eel.expose
def list_audios():
    global objectYT
    audios = list()
    for item in objectYT.streams.filter(only_audio=True):
        audios.append(
            {
                "itag": item.itag,
                "mime_type": item.mime_type,
                "abr": item.abr,
                "size": round(item.filesize_approx / 1000000, 2),
            }
        )
    return audios


@eel.expose
def list_videos(ext: str = "webm" or "mp4"):
    global objectYT
    videos = list()
    for item in objectYT.streams.filter(only_video=True, file_extension=ext):
        videos.append(
            {
                "itag": item.itag,
                "res": item.resolution,
                "codec": item.parse_codecs()[0],
                "size": round(item.filesize_approx / 1000000, 2),
            }
        )
    return videos


@eel.expose
def download_by_itag(itag: int):
    global objectYT
    global pathMusic
    stream = objectYT.streams.get_by_itag(itag)
    if stream.parse_codecs()[0] is None:
        if stream.parse_codecs()[1].startswith("mp4"):
            rename_audio = f"{stream.default_filename[:-4]}.m4a"
        else:
            rename_audio = f"{stream.default_filename[:-5]}.opus"
        stream.download(output_path=pathMusic, filename=rename_audio)
    else:
        stream.download(output_path=pathMusic)


@eel.expose
def bestaudio_dl(url):
    # pendiente por implementar en el frontend
    global pathMusic
    system(f"cd {pathMusic}; youtube-dl -x -f bestaudio {url}")


if __name__ == "__main__":
    eel.init("webUI")
    objectYT = None
    pathMusic = None
    if system() == "Windows":
        pathMusic = f"C:\\Users\\{getuser()}\\Music"
    elif system() == "Linux":
        pathMusic = f"/home/{getuser()}/Music"
    eel.start("index.html", mode="firefox")
