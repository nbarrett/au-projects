import { atom, atomFamily, RecoilState, selectorFamily } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { firestoreState } from "./firestore-atoms";
import { Company } from "../models/company-models";

export const companiesState = atom<Company[]>({
  key: StoredValue.COMPANIES,
  default: []
});

// export const companiesState: RecoilState<Customer[]> = selector({
//   key: StoredValue.COMPANIES,
//   get: async ({get}) => {
//     const firestore = get(firestoreState);
//     const companiesSnapshot = await firestore.collection("companies").get();
//     const companyDocuments = [...companiesSnapshot.docs].map((doc) => {
//       const companyData = doc.data();
//       const company = {
//         id: companyData.id,
//         address: companyData.address,
//         avatarUrl: companyData.avatarUrl,
//         createdAt: companyData.createdAt,
//         primaryContact: companyData.primaryContact
//       };
//       log.info("found company:", company)
//       return company;
//     });
//     log.info("found", companyDocuments.length, "companies");
//     return companyDocuments;
//   },
//   set: async ({get}) => {
//     const firestore = get(firestoreState);
//     const companiesSnapshot = await firestore.collection("companies").get();
//     const companyDocuments = [...companiesSnapshot.docs].map((doc) => {
//       const companyData = doc.data();
//       const company = {
//         id: companyData.id,
//         address: companyData.address,
//         avatarUrl: companyData.avatarUrl,
//         createdAt: companyData.createdAt,
//         primaryContact: companyData.primaryContact
//       };
//       log.info("found company:", company)
//       return company;
//     });
//     log.info("found", companyDocuments.length, "companies");
//     return companyDocuments;
//   },
// });
//
// export const movieState = selectorFamily({
//   key: "movieState",
//   get: (id: string) => async ({get}) => {
//     const firestore = get(firestoreState);
//     const movieDoc = await firestore.doc(`movies/${id}`).get();
//     return movieDoc.data();
//   },
// });
//
// const userInfoQueryRequestIDState = atomFamily({
//   key: "UserInfoQueryRequestID",
//   default: 0,
// });
//

// export const companyStateRecoilState : RecoilState<Customer> = selectorFamily({
//   key: StoredValue.COMPANY,
//   get: (id: string) => async ({ get }) => {
//     const firestore = get(firestoreState);
//     const movieDoc = await firestore.doc(`movies/${id}`).get();
//     // return movieDoc.data();
//     return Promise.resolve({
//       id: "",
//       address: null,
//       avatarUrl: "",
//       createdAt: "",
//       primaryContact: ""
//     });
//   },
//   // set: async ({ set, get }, id: string) => {
//   //   const ref = `companies/${data.id}/video/${data.file.name}`;
//   //
//   //   // Get your storage instance
//   //   const storage = get(firestoreStorageState);
//   //   // Use it!
//   //   const task = storage.ref(ref).put(data.file);
//   //
//   //   // The value of the videoUploadProgressState becomes a reference to the firebase.storage.UploadTask
//   //   // This is so we can listen to it in the main thread (i.e within a component)
//   //   // set(videoUploadProgressState, task);
//   //
//   //   const upload = await task;
//   //   const response = await fetch(
//   //       "https://www.yourwebsite.com/streaming/upload",
//   //       {
//   //         method: "post",
//   //         headers: {
//   //           "Content-type": "application/json",
//   //         },
//   //         body: JSON.stringify({ url: await upload.ref.getDownloadURL() }),
//   //       }
//   //   );
//   //   const firestore = get(firestoreState);
//   //
//   //   const movieDoc = firestore.doc(`movies/${data.id}`);
//   //   const result = await response.json();
//   //   movieDoc.update({ assetRef: result.playback_id });
//   //   // return result.playback_id;
//   // },
// });
//
