import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject
export class User {

    @JsonProperty("_id", String, false)
    _id: string;

    @JsonProperty("kode", String, false)
    kode: string;

    @JsonProperty("nama", String, false)
    nama: string;

    @JsonProperty("alamat", String, false)
    alamat: string;

    @JsonProperty("alamatSurat", String, false)
    alamatSurat: string;

    @JsonProperty("kodeKonsumen", String, false)
    kodeKonsumen: string;

    @JsonProperty("kodeKaryawan", String, false)
    kodeKaryawan: string;

    @JsonProperty("kodeDivisi", String, false)
    kodeDivisi: string;

    @JsonProperty("namaDivisi", String, false)
    namaDivisi: string;

    @JsonProperty("kodeJabatan", String, false)
    kodeJabatan: string;

    @JsonProperty("namaJabatan", String, false)
    namaJabatan: string;

    @JsonProperty("noHp", String, false)
    noHp: string;

    @JsonProperty("email", String, false)
    email: string;

    @JsonProperty("password", String, false)
    password: string;

    @JsonProperty("kodeVerifikasi", String, false)
    kodeVerifikasi: string;

    @JsonProperty("confirmPassword", String, false)
    confirmPassword: string;

    @JsonProperty("loginOtomatis", Boolean, false)
    loginOtomatis: boolean;

    @JsonProperty("avatarLink", String, false)
    avatarLink: string;

    @JsonProperty("avatarLinkThumb", String, false)
    avatarLinkThumb: string;

    @JsonProperty("aktif", Boolean, false)
    aktif: boolean;

    @JsonProperty("memberId", String, false)
    memberId: string;

    @JsonProperty("userGroup", String, false)
    userGroup: string;

    @JsonProperty("tglJoin", Date, false)
    tglJoin: Date;

    @JsonProperty("tglExp", Date, false)
    tglExp: Date;

}