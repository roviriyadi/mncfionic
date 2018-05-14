import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ApplChecklist {

    @JsonProperty("kodeDokumen", String, false)
    kodeDokumen: string;

    @JsonProperty("namaDokumen", String, false)
    namaDokumen: string;

    @JsonProperty("adaFile", Boolean, false)
    adaFile: boolean;

    @JsonProperty("lokasiFile", String, false)
    lokasiFile: string;

    @JsonProperty("namaFile", String, false)
    namaFile: string;

    @JsonProperty("jenisFile", String, false)
    jenisFile: string;

}