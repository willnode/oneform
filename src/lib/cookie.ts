import type { StateStorage } from "zustand/middleware";
import type { CookieAttributes } from "js-cookie";

import Cookies from "js-cookie";

const CookieStorage = (
    key: string,
    options: CookieAttributes = {
        expires: new Date(new Date().setFullYear(9999)),
    }
): StateStorage => {
    // return a StateStorage object with the required functions
    return {
        getItem: async (name: string): Promise<string | null> => {
            // attempt to get the cookie
            const cookie = Cookies.get(name);

            // if the cookie exists return it
            //    otherise return null
            return typeof cookie !== "undefined" ? JSON.stringify({
                state: { [key]: cookie }, version: 0
            }) : null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
            // set a cookie with options
            let v = JSON.parse(value);
            console.log(name);
            Cookies.set(name, v.state[key], options);
        },
        removeItem: async (name: string): Promise<void> => {
            // delete a cookie with a matching name and
            //    matching options
            Cookies.remove(name, options);
        },
    };
};

export default CookieStorage;