import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class Notifikasi {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("judul", String, false)
    judul: string;

    @JsonProperty("keteranganSingkat", String, false)
    keteranganSingkat: string;

    @JsonProperty("pesan", String, false)
    pesan: string;

    @JsonProperty("namaPengirim", String, false)
    namaPengirim: string;

    @JsonProperty("waktu", Date, false)
    waktu: Date;

    @JsonProperty("dibaca", Boolean, false)
    dibaca: Boolean;

    @JsonProperty("tipe", String, false)
    tipe: string;

    @JsonProperty("kodeReferensi", String, false)
    kodeReferensi: string;

}