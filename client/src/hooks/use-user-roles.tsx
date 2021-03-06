import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import * as React from "react";
import { useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { userRolesState } from "../atoms/user-atoms";
import { UserRoles } from "../models/user-models";
import { newDocument } from "../mappings/document-mappings";
import { useFirebaseUser } from "./use-firebase-user";

export default function useUserRoles() {
    const collection = "userRoles";
    const [documents, setDocuments] = useRecoilState<WithUid<UserRoles>[]>(userRolesState);
    const {user, loading} = useFirebaseUser();
    const pendingUserRoles = documents.length === 0;
    useEffect(() => {
        if (user && !loading) {
            log.debug(collection, "initial render:", documents);
            const unsub = subscribe<UserRoles>(collection, setDocuments);
            return (() => {
                unsub();
            });
        }
    }, [user, loading]);

    useEffect(() => {
        log.debug(collection, "change:", documents);
    }, [documents]);

    function forCurrentUser(): WithUid<UserRoles> {
        return userRoleForUid(user?.uid);
    }

    function refresh(): Promise<any> {
        return findAll<UserRoles>(collection).then(setDocuments);
    }

    function saveAllUserRoles(): Promise<void> {
        return saveAll<UserRoles>(collection, documents).then((response) => {
            log.debug(collection, "save all response was:", response);
        });
    }

    function setDocument(updatedUser: WithUid<UserRoles>) {
        log.debug("setDocument:", updatedUser);
        if (!documents.find(item => item.uid === updatedUser.uid)) {
            setDocuments(documents.concat(updatedUser));
        } else {
            setDocuments(documents.map(userRole => userRole.uid === updatedUser.uid ? updatedUser : userRole));
        }

    }

    function newDocumentFor(uid: string) {
        const userRolesWithUid = newDocument<UserRoles>();
        userRolesWithUid.createWithId = true;
        userRolesWithUid.uid = uid;
        return userRolesWithUid;
    }

    function userRoleForUid(uid: string): WithUid<UserRoles> {
        const returnValue = cloneDeep(documents?.find(userRole => userRole?.uid === uid) || newDocumentFor(uid));
        log.debug("userRoleForUid:", returnValue);
        return returnValue;
    }

    return {saveAllUserRoles, refresh, documents, setDocument, setDocuments, userRoleForUid, forCurrentUser, pendingUserRoles};

}
