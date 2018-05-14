import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApprovalResult {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("tglResult", Date, false)
    tglResult: Date;

    @JsonProperty("kodeUser", String, false)
    kodeUser: string;

    @JsonProperty("kodeApproval", String, false)
    kodeApproval: string;

    @JsonProperty("kodeStatus", String, false)
    kodeStatus: string;

    @JsonProperty("catatan", String, false)
    catatan: string;
    
    @JsonProperty("synced", Boolean, false)
    synced: boolean;

}