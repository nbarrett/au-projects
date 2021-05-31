import { WithUid } from '../models/common-models';
import { find, save } from '../data-services/firebase-services';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { log } from '../util/logging-config';
import { userState } from '../atoms/user-atoms';
import { UserData } from '../models/user-models';

export default function useSingleUser() {
    const [user, setUser] = useRecoilState<WithUid<UserData>>(userState);

    useEffect(() => {
        log.info("User change:", user);
    }, [user])


    function saveUser() {
        save<UserData>("users", user).then((response) => {
            log.info("response was:", response)
        });
    }

    function findUser(uid: string) {
        find<UserData>("users", uid).then((response) => {
            log.info("response was:", response)
            setUser(response)
        });
    }

    return {findUser, saveUser, user, setUser}

}
