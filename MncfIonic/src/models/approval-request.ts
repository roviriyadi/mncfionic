import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApprovalRequest {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeGroup", String, false)
    kodeGroup: string;

    @JsonProperty("kodeReferensi", String, false)
    kodeReferensi: string;

    @JsonProperty("judul", String, false)
    judul: string;

    @JsonProperty("kodeStatus", String, false)
    kodeStatus: string;

    @JsonProperty("levelProses", Number, false)
    levelProses: number;

    @JsonProperty("kontenHtml", String, false)
    kontenHtml: string;

}