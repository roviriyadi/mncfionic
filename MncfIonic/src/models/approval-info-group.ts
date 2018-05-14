import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApprovalInfoGroup {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeApprovalGroup", String, false)
    kodeApprovalGroup: string;

    @JsonProperty("nama", String, false)
    nama: string;

    @JsonProperty("icon", String, false)
    icon: string;

}