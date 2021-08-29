import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import * as React from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { usersState } from "../atoms/user-atoms";
import { UserData } from "../models/user-models";
import { sortBy } from "../util/arrays";
import { GridValueGetterParams } from "@material-ui/data-grid";
import NamedAvatar from "../pages/users/NamedAvatar";
import cloneDeep from "lodash/cloneDeep";

export const collection = "users";

export default function useUsers() {
    const [documents, setDocuments] = useRecoilState<WithUid<UserData>[]>(usersState);

    useEffect(() => {
        log.debug("Users initial render:", documents);
        const unsub = subscribe<UserData>(collection, setAndSort);
        return (() => {
            unsub();
        });
    }, []);

    useEffect(() => {
        log.debug("Users change:", documents);
    }, [documents]);

    function setAndSort(response: WithUid<UserData>[]) {
        setDocuments(response
            .sort(sortBy("data.lastName", "data.firstName")));
    }

    function mutableUsers(): WithUid<UserData>[] {
        return cloneDeep(documents);
    }

    function refresh(): Promise<any> {
        return findAll<UserData>(collection).then(setAndSort);
    }

    function saveAllUsers(): Promise<void> {
        return saveAll<UserData>(collection, documents).then((response) => {
            log.debug("response was:", response);
        });
    }

    function setDocument(updatedUser: WithUid<UserData>) {
        const newUsers = documents.map(user => user.uid === updatedUser.uid ? updatedUser : user);
        setDocuments(newUsers);
    }

    function userForUid(uid: string): WithUid<UserData> {
        return mutableUsers()?.find(user => user?.uid === uid);
    }

    function NamedAvatarFromGrid(params: GridValueGetterParams): JSX.Element {
        return <NamedAvatar user={params.row as UserData}/>;
    }


    return {
        refresh, saveAllUsers, documents, setDocuments, setDocument, userForUid,
        NamedAvatarFromGrid
    };

}
