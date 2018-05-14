import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ProspekUnit {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kodeCompany", String, false)
    kodeCompany: string;

    @JsonProperty("kodeProject", String, false)
    kodeProject: string;

    @JsonProperty("kodeKonsumen", String, false)
    kodeKonsumen: string;

    @JsonProperty("kodeUnit", String, false)
    kodeUnit: string;

    @JsonProperty("namaUnit", String, false)
    namaUnit: string;

    @JsonProperty("informasi", String, false)
    informasi: string;

}