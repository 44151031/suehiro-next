// 📦 /src/lib/campaignMaster.ts
import { campaignsA } from "./campaignMasterA";
import { campaignsB } from "./campaignMasterB";
import { campaignsC } from "./campaignMasterC";
import { campaignsD } from "./campaignMasterD";
import { campaignsE } from "./campaignMasterE";
import { campaignsF } from "./campaignMasterF";
import { campaignsG } from "./campaignMasterG";
import { campaignAdditions202609 } from "./campaignAdditions202609";

export const campaigns = [...campaignAdditions202609, ...campaignsA, ...campaignsB, ...campaignsC, ...campaignsD, ...campaignsE, ...campaignsF, ...campaignsG];
