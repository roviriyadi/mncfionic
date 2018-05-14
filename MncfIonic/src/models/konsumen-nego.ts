import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class KonsumenNego {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeKonsumen", String, false)
    kodeKonsumen: string;

    @JsonProperty("judul", String, false)
    judul: string;

    @JsonProperty("kodeStatus", String, false)
    kodeStatus: string;

    @JsonProperty("posted", Boolean, false)
    posted: boolean;

    @JsonProperty("tglPost", Date, false)
    tglPost: Date;

    @JsonProperty("synced", Boolean, false)
    synced: boolean;

    uploaded: boolean;

}