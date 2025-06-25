import {
  buildCCPOrg

} from "../utils/AppUtils.js";

export function getCCP(org) {
  let ccp;
ccp = buildCCPOrg(org);

  console.log("✅ From getCCP:", org, "→", ccp);
  return ccp;
}
