import { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3, buildCCPOrg4, buildCCPOrg5, buildCCPOrg6 } from "../utils/AppUtils.js";

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
        case 4:
            ccp = buildCCPOrg4(); 
            break;
        case 5:
            ccp = buildCCPOrg5(); 
            break;
        case 6:
            ccp = buildCCPOrg6();
            break;
    }
     console.log('from cpp build.js',ccp)
    return ccp;
}