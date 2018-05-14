import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class SysProject {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kodeCompany", String, false)
    kodeCompany: string;
    
    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("nama", String, false)
    nama: string;

}