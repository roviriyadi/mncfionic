import { JsonObject, JsonProperty } from "json2typescript";
import { DateTime } from "ionic-angular/components/datetime/datetime";

@JsonObject
export class ApprovalProgress {

    @JsonProperty("levelNo", Number, false)
    levelNo: number;

    @JsonProperty("sudahProses", Boolean, false)
    sudahProses: boolean;

    @JsonProperty("kodeApproval", String, false)
    kodeApproval: string;

    @JsonProperty("tglResult", String, false)
    tglResult: String;

    @JsonProperty("kodeUser", String, false)
    kodeUser: string;

    @JsonProperty("avatarLink", String, false)
    avatarLink: string;

    @JsonProperty("namaUser", String, false)
    namaUser: string;

    @JsonProperty("namaDivisi", String, false)
    namaDivisi: string;

    @JsonProperty("namaJabatan", String, false)
    namaJabatan: string;

    @JsonProperty("namaStatus", String, false)
    namaStatus: string;

    @JsonProperty("catatan", String, false)
    catatan: string;

}