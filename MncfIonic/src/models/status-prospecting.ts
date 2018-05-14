import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class StatusProspecting {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("deskripsi", String, false)
    deskripsi: string;

    @JsonProperty("noUrut", Number, false)
    noUrut: number;

}