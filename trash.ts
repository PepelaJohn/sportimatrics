const processFile = async (file: File) => {
    setProcessingComplete(false);
    const zip = new JSZip();
    let zipData: JSZip;
    try {
      zipData = await zip.loadAsync(file);
    } catch (error: any) {
      dispatch({ type: ERROR, payload: "Error parsing file" });
      return;
    }
  
    const musicHistory: any[] = [];
    const podcastHistory: any[] = [];
    const playlistHistory: { [key: string]: any } = [];
    let rest: { [key: string | number]: any } = {};
  
    const processZipEntry = async (zipEntry: JSZip.JSZipObject, path: string = "") => {
      if (!zipEntry.dir) {
        if (
          !zipEntry.name.endsWith(".json") ||
          zipEntry.name.toLowerCase().startsWith("inferences") ||
          zipEntry.name.toLowerCase().startsWith("searchqueries")
        )
          return; // Skip non-JSON files
  
        const filename = path ? `${path}/${zipEntry.name}` : zipEntry.name;
        
        return zipEntry
          .async("string", (metadata) => {
            setFileProgress((prevProgress) => ({
              ...prevProgress,
              [filename]: metadata.percent,
            }));
          })
          .then((fileContent) => {
            try {
              const jsonContent = JSON.parse(fileContent);
  
              if (
                filename.startsWith("StreamingHistory_music_") &&
                filename.endsWith(".json")
              ) {
                musicHistory.push(...jsonContent);
              } else if (
                filename.startsWith("StreamingHistory_podcast_") &&
                filename.endsWith(".json")
              ) {
                podcastHistory.push(...jsonContent);
              } else if (
                filename.startsWith("Playlist") &&
                filename.endsWith(".json")
              ) {
                playlistHistory.push(...jsonContent.playlists);
              } else {
                rest[filename.replace(".json", "").toLowerCase()] = jsonContent;
              }
            } catch (error: any) {
              dispatch({
                type: ERROR,
                payload: error.message || "Error parsing file",
              });
            }
          });
      } else {
        await Promise.all(
          Object.keys(zipData.files).map(async (nestedFilename) => {
            const nestedFile = zipData.file(nestedFilename);
            if (nestedFile) {
              await processZipEntry(nestedFile, filename);
            }
          })
        );
      }
    };
  
    await Promise.all(
      Object.keys(zipData.files).map(async (filename) => {
        const file = zipData.file(filename);
        if (file) {
          await processZipEntry(file);
        }
      })
    );
  
    if (musicHistory.length === 0 && podcastHistory.length === 0) {
      dispatch({ type: ERROR, payload: "No files" });
    } else {
      const combinedData = {
        music_history: musicHistory,
        podcast_history: podcastHistory,
        playlists: playlistHistory,
        ...rest,
      };
      setData(combinedData);
      dispatch({ type: SUCCESS, payload: "Successfully uploaded" });
    }
  
    setProcessingComplete(true);
  };
  