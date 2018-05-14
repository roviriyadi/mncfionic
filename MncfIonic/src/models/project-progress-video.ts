import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class ProjectProgressVideo {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("keterangan", String, false)
    keterangan: string;

    @JsonProperty("tglPublish", Date, false)
    tglPublish: Date;

    @JsonProperty("filePath", String, false)
    filePath: string;

    @JsonProperty("thumbPath", String, false)
    thumbPath: string;

}