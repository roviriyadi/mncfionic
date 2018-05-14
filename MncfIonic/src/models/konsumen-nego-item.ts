import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class KonsumenNegoItem {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeNego", String, false)
    kodeNego: string;

    @JsonProperty("deskripsi", String, false)
    deskripsi: string;

    @JsonProperty("synced", Boolean, false)
    synced: boolean;

    uploaded: boolean;

    edited: boolean;

}