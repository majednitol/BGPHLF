import { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3 } from "../utils/AppUtils.js";

export function getCCP(org) {
    let ccp;
    switch (org) {
        case 1:
            ccp = buildCCPOrg1();
            break;
        case 2:
            ccp = buildCCPOrg2();
            break;
        case 3:
            ccp = buildCCPOrg3();
            break;
    }
    return ccp;
}