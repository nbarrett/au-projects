import { WithUid } from "../models/common-models";
import { saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { usersState } from "../atoms/user-atoms";
import { UserData } from "../models/user-models";

export default function useAllUsers() {
    const [users, setUsers] = useRecoilState<WithUid<UserData>[]>(usersState);

    useEffect(() => {
        log.info("Users initial render:", users);
        const unsub = subscribe<UserData>("users", setUsers)
        return (() => {
            unsub()
        })
    }, [])

    useEffect(() => {
        log.info("Users change:", users);
    }, [users])


    function saveAllUsers() {
        saveAll<UserData>("users", users).then((response) => {
            log.info("response was:", response)
        });
    }

    function setOne(updatedUser: WithUid<UserData>) {
        const newUsers = users.map(user => user.uid === updatedUser.uid ? updatedUser : user);
        setUsers(newUsers);
    }

    return {saveAllUsers, users, setUsers, setOne}

}
