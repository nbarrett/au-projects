import { firestoreState, firestoreStorageState } from "./firestore";
import { atom, selector, selectorFamily } from "recoil";
import firebase from "firebase/app";

export const allMovieState = selector({
  key: "allMovieState",
  get: async ({ get }) => {
    // Get your firestore instance
    const firestore = get(firestoreState);
    // Use it!
    const movies = await firestore.collection("movies").get();
    const movieNames = [...movies.docs].map((doc) => {
      const movieData = doc.data();
      return {
        id: doc.id,
        title: movieData.title,
        assetRef: movieData.assetRef, // refers to the streaming asset
      };
    });
    return movieNames;
  },
});

// This selector is used to pull a specific movie
export const movieState = selectorFamily({
  key: "movieState",
  get: (id: string) => async ({ get }) => {
    const firestore = get(firestoreState);
    const movieDoc = await firestore.doc(`movies/${id}`).get();
    return movieDoc.data();
  },
});

// // Track the upload task
// export const videoUploadProgressState = atom<firebase.storage.UploadTask>({
//   key: "videoProgress",
//   default: Promise.resolve()  // Value is going to be of type <firebase.storage.UploadTask>
// });

// Begin uploading video
export const videoUploadState = selector({
  key: "videoUploadState",
  get: async ({ get }) => {
    return "";
  },
  set: async ({ set, get }, data: { [key: string]: any }) => {
    const ref = `movies/${data.id}/video/${data.file.name}`;

    // Get your storage instance
    const storage = get(firestoreStorageState);
    // Use it!
    const task = storage.ref(ref).put(data.file);

    // The value of the videoUploadProgressState becomes a reference to the firebase.storage.UploadTask
    // This is so we can listen to it in the main thread (i.e within a component)
    // set(videoUploadProgressState, task);

    const upload = await task;
    const response = await fetch(
      "https://www.yourwebsite.com/streaming/upload",
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ url: await upload.ref.getDownloadURL() }),
      }
    );
    const firestore = get(firestoreState);

    const movieDoc = firestore.doc(`movies/${data.id}`);
    const result = await response.json();
    movieDoc.update({ assetRef: result.playback_id });
    return result.playback_id;
  },
});
