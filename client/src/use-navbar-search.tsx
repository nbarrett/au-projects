import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { log } from './util/logging-config';
import { replaceAll } from './util/strings';
import { useRecoilState } from 'recoil';
import { navbarSearchState } from './atoms/navbar-atoms';

export function useNavbarSearch(): { search: string; onChange(value: string): void; } {
    const location = useLocation();
    const [search, setSearch] = useRecoilState<string>(navbarSearchState)

    useEffect(() => {
        log.info("location.pathname changed to", location.pathname)
        const search = currentStoredValue();
        log.info("search:", search)
        setSearch(search);
    }, [location.pathname])

    useEffect(() => {
        log.info("changeEvents:", search)
    }, [search])

    function currentStoredValue() {
        return localStorage.getItem(key()) || "";
    }

    function key(): string {
        return `au-projects-search${replaceAll("/", "-", location.pathname)}`;
    }

    function onChange(search: string) {
        const searchKey = key();
        log.info("onChange:value", search, "setting local storage:", searchKey)
        localStorage.setItem(searchKey, search)
        setSearch(search);
    }

    return {search, onChange}
}
