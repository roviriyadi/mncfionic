import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ProspekFollowup {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("kodeKonsumen", String, false)
    kodeKonsumen: string;

    @JsonProperty("waktuFollowup", Date, false)
    waktuFollowup: Date;

    @JsonProperty("kodeStatus", String, false)
    kodeStatus: string;

    @JsonProperty("catatan", String, false)
    catatan: string;

    @JsonProperty("synced", Boolean, false)
    synced: Boolean;

}