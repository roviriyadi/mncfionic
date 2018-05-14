import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class JadwalPembayaran {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("noTagihan", String, false)
    noTagihan: string;

    @JsonProperty("deskripsi", String, false)
    deskripsi: string;

    @JsonProperty("tglTagihan", Date, false)
    tglTagihan: Date;

    @JsonProperty("tglJatuhTempo", Date, false)
    tglJatuhTempo: Date;

    @JsonProperty("totalTagihan", Number, false)
    totalTagihan: number;

    @JsonProperty("sudahDibayar", Number, false)
    sudahDibayar: number;

    @JsonProperty("sisaTagihan", Number, false)
    sisaTagihan: number;

}