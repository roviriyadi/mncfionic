import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class MasterUnit {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("nama", String, false)
    nama: string;

    @JsonProperty("informasi", String, false)
    informasi: string;

}