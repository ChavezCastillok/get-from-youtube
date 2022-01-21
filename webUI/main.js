addEventListener("load", () => {
  // main program
  let slink = document.getElementById("slink");
  let searchlink = document.getElementById("searchlink");
  let btnSearch = document.getElementById("search");
  let videoAudio = document.getElementById("vora");
  let optionsDL = document.getElementById("options");
  let btnDL = document.getElementById("dl");

  videoAudio.disabled = true;

  videoAudio.addEventListener("change", () => {
    if (videoAudio.value == "video/webm") {
      console.log("these are webm videos.");
      optionsDL.innerHTML = "";
      show_videos("webm");
    } else if (videoAudio.value == "video/mp4") {
      console.log("these are mp4 videos.");
      optionsDL.innerHTML = "";
      show_videos("mp4");
    } else if (videoAudio.value == "audio") {
      console.log("these are audios.");
      optionsDL.innerHTML = "";
      show_audios();
    } else if (videoAudio.value == "null") {
      console.log("Waiting select between audio or video...");
    }
  });

  slink.addEventListener("input", () => {
    if (slink.value.trim() == "") {
      btnSearch.disabled = true;
    } else {
      btnSearch.disabled = false;
    }
  });
  slink.addEventListener("click", () => {
    slink.value = "";
  });

  searchlink.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(`Type ${slink.value}`);
    searchFromPytube(slink.value);
  });

  btnDL.addEventListener("click", () => {
    console.log("star download process...");
    let streams = document.getElementsByName("streams");
    let itag = "";
    for (let stream of streams) {
      if (stream.checked) {
        itag = stream.value;
      }
    }
    itag = parseInt(itag);
    download_stream_by_itag(itag);
  });

  console.log("runned");
});

async function searchFromPytube(entry) {
  let title = document.getElementById("title");
  let author = document.getElementById("author");
  let barCharging = document.getElementById("charging");
  let videoAudio = document.getElementById("vora");

  title.innerText = "Charging";

  let fromPy = await eel.search_link_fromYT(entry)();
  barCharging.style.display = "None";
  title.innerText = fromPy.title;
  author.innerText = fromPy.author;
  videoAudio.disabled = false;
}

async function show_videos(ext = "webm" || "mp4") {
  let optionsDL = document.getElementById("options");
  optionsDL.innerHTML = "<small>Charging</small><progress></progress>";
  let list = await eel.list_videos(ext)();
  optionsDL.innerText = "";
  list.forEach((video) => {
    optionsDL.innerHTML += `
    <label for="streams">
      <input type="radio" name="streams" value="${video.itag}" />
      ${video.res} | ${video.codec} | ${video.size} MB approx.
    </label>
    `;
  });
  download_available();
}

async function show_audios() {
  let optionsDL = document.getElementById("options");
  optionsDL.innerHTML = "<small>Charging</small><progress></progress>";
  let list = await eel.list_audios()();
  optionsDL.innerText = "";
  list.forEach((audio) => {
    optionsDL.innerHTML += `
    <label for="streams">
      <input type="radio" name="streams" value="${audio.itag}" />
      ${audio.mime_type} | ${audio.abr} | ${audio.size} MB approx.
    </label>
    `;
  });
  download_available();
}

function download_available() {
  document.getElementById("dl").disabled = false;
}

async function download_stream_by_itag(itag) {
  let running_dl = document.getElementById("downloading");
  document.getElementById("dl").disabled = true;
  running_dl.innerHTML = "<small>Downloading</small><progress></progress>";
  let dl = await eel.download_by_itag(itag)();
  document.getElementById("dl").disabled = false;
  if (dl == null) {
    running_dl.innerHTML = "Download finished.";
    alert("Download finished.");
    document.getElementById("vora")[0].selected = true;
    location.reload();
  } else {
    running_dl.innerHTML = "Download not finished.";
  }
}
