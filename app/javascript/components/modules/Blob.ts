import {
    blobBlue,
    blobGray,
    blobGreen,
    blobPink,
    blobPurple,
    blobYellow
} from "../../images";

export default function blobForUser(blobNumber?: number) {
    if (blobNumber === undefined || blobNumber === null) {
        return blobGray;
    }

    switch (blobNumber % 5) {
        case 0: return blobBlue;
        case 1: return blobGreen;
        case 2: return blobYellow;
        case 3: return blobPurple;
        case 4: return blobPink;
    }
}