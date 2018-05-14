import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class StarterKit {
    
    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("judul", String, false)
    judul: string;  

    @JsonProperty("linkGambar", String, false)
    linkGambar: string;

}