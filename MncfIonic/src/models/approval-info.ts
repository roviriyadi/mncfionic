import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApprovalInfo {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeApproval", String, false)
    kodeApproval: string;

    @JsonProperty("kodeInfoGroup", String, false)
    kodeInfoGroup: string;

    @JsonProperty("label", String, false)
    label: string;

    @JsonProperty("value", String, false)
    value: string;

}