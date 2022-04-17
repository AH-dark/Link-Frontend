import CryptoJS from "crypto-js";

const Gateway = "https://avatar.sourcegcdn.com/avatar/";

export const GetAvatar = (email: string, size: number = 80): string => {
    const emailHash = CryptoJS.MD5(email.trim()).toString();
    return `${Gateway + emailHash}?s=${size}`;
};
