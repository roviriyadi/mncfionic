import { JsonObject, JsonProperty } from "json2typescript";
import { DateTime } from "ionic-angular/components/datetime/datetime";

@JsonObject
export class CalonKonsumen {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("nama", String, false)
    nama: string;

    @JsonProperty("noHp", String, false)
    noHp: string;

    @JsonProperty("email", String, false)
    email: string;

    @JsonProperty("kodeKota", String, false)
    kodeKota: string;

    @JsonProperty("catatan", String, false)
    catatan: string;

    @JsonProperty("catatanSales", String, false)
    catatanSales: string;

    @JsonProperty("kodeStatus", String, false)
    kodeStatus: string;

    @JsonProperty("followupStatus", String, false)
    followupStatus: string;

    @JsonProperty("kodeKonsumen", String, false)
    kodeKonsumen: string;

    @JsonProperty("kodeMarketing", String, false)
    kodeMarketing: string;

    @JsonProperty("kodeUserInput", String, false)
    kodeUserInput: string;

    @JsonProperty("tglInput", DateTime, false)
    tglInput: DateTime;

    @JsonProperty("synced", Boolean, false)
    synced: boolean;

    @JsonProperty("kodeDataSource", String, false)
    kodeDataSource: string;
}