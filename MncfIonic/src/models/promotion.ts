import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class Promotion {
    
    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("deskripsi", String, false)
    deskripsi: string;

    @JsonProperty("gambar", String, false)
    gambar: string;

    @JsonProperty("link", String, false)
    link: string;

}